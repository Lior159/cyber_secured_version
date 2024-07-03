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

router.get("/forgot", passController.getForgotPasswordPage);

router.post("/forgot", passController.sendOTP);

router.get("/reset/:uname", passController.getResetPasswordPage);

router.post("/reset", passController.setNewPassword);

module.exports = router;
