require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const MSSQLStore = require("connect-mssql-v2");
const authRouter = require("./routes/auth");
const passRouter = require("./routes/pass");
const managementRouter = require("./routes/management");
const { connectToDatabase, config } = require("./utils/db");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MSSQLStore(config, {
      ttl: 1000 * 60 * 60,
      autoRemoveInterval: 1000 * 60,
      autoRemove: true,
    }),
    cookie: {
      // secure // used for https,
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(authRouter);
app.use(passRouter);
app.use(managementRouter);

connectToDatabase()
  .then(() => {
    const port = process.env.SERVER_PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database. Server not started.");
  });

const shutdown = async () => {
  try {
    if (pool) {
      await pool.close();
      console.log("Database connection pool closed");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown", err);
    process.exit(1);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
