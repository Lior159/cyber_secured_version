const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "signup.html"));
});

module.exports = router;