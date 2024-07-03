const express = require("express");
const authController = require("../controlles/auth");
const passController = require("../controlles/pass");

const router = express.Router();

router.get(
  "/update",
  authController.isAuth,
  passController.getPasswordUpdatePage
);

router.post("/update", authController.isAuth, passController.updatePassword);

// router.post("/update", authController.login);

// router.get("/reset", authController.getSignupPage);

// router.post("/reset", authController.signUp);

module.exports = router;
