const express = require("express");
const managementController = require("../controlles/management");
const authController = require("../controlles/auth");

const router = express.Router();

router.get("/", authController.isAuth, managementController.getNewCustomerPage);

router.get(
  "/create_customer",
  authController.isAuth,
  managementController.getNewCustomerPage
);

router.post(
  "/create_customer",
  authController.isAuth,
  managementController.createCustomer
);

module.exports = router;
