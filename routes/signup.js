const express = require("express");
const path = require("path");
const sql = require("mssql");
const { getPool } = require("../db");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  const pool = getPool();
});

module.exports = router;
