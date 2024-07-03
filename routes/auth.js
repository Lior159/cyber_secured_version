const express = require("express");
const authController = require("../controlles/auth");

const router = express.Router();

router.get("/login", authController.getLoginPage);

router.post("/login", authController.login);

router.get("/logout", authController.isAuth, authController.logout);

router.get("/signup", authController.getSignupPage);

router.post("/signup", authController.signUp);

module.exports = router;
