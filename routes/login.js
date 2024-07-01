const express = require("express");
const path = require("path");
const sql = require("mssql");
const { getPool } = require("../db");

const router = express.Router();

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "login.html"));
});

router.post("/login", async (req, res) => {
  const pool = getPool();
  const result = await pool.query(
    `select * from users where password = ${req.body.password}`
  );
  // const result = await pool
  //   .request()
  //   .input("email", sql.VarChar, req.body.email)
  //   .query("select * from users where email = @email");
  console.log(result);
});

module.exports = router;
