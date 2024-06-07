const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "login.html"));
});

router.post("/login", (req, res) => {
  console.log(req.body.email);
});

module.exports = router;
