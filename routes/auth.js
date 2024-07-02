const express = require("express");
const path = require("path");
const sql = require("mssql");
const { getPool } = require("../db");
const authController = require("../controlles/auth");

const router = express.Router();

router.get("/login", authController.getLoginPage);

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

router.get("/signup", authController.getSignupPage);

router.post("/signup", authController.signUp);

module.exports = router;
