const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const { connectToDatabase } = require("./db");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(loginRouter);
app.use(signupRouter);

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
