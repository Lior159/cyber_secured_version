const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const sql = require("mssql");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const authRouter = require("./routes/auth");
const { connectToDatabase, getPool } = require("./db");
const {
  passwordValidation,
  encryptPassword,
  validatePassword,
} = require("./pass_config");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(authRouter);

connectToDatabase()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database. Server not started.");
  });

// Graceful shutdown
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
