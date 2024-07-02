const express = require("express");
const path = require("path");
const { encode } = require("html-entities");
const {
  passwordValidation,
  encryptPassword,
  validatePassword,
} = require("../pass_config");
const sql = require("mssql");
const { getPool } = require("../db");
const validator = require("validator");

const getLoginPage = (req, res) => {
  res.render("login");
};

const getSignupPage = (req, res) => {
  res.render("signup");
};

const login = (req, res) => {
  const uname = req.body.uname;
  const password = req.body.password;
};

const signUp = async (req, res) => {
  try {
    const uname = req.body.uname;
    const password = req.body.password;
    const email = req.body.email;

    const validUname = validator.isAscii(uname);
    const validPassword = validatePassword(password);
    const validEmail = validator.isEmail(email);

    if (validPassword) {
      console.log(validPassword);
      return res.render("signup", {
        errorMessage: validPassword,
      });
    }

    if (!validEmail) {
      return res.render("signup", {
        errorMessage: "Invalid email",
      });
    }

    if (!validUname) {
      return res.render("signup", {
        errorMessage: "Invalid Username",
      });
    }

    const { hash, salt } = await encryptPassword("lior159");
    const db_res = await getPool()
      .request()
      .input("uname", sql.VarChar, uname)
      .input("password", sql.VarChar, hash)
      .input("email", sql.VarChar, email)
      .input("salt", sql.VarChar, salt)
      .query(
        `INSERT INTO Users (uname, password, email) VALUES (@uname, @password, @email)
        INSERT INTO Secrets (uname, salt) VALUES (@uname, @salt)
        `
      );

    console.log(db_res);

    return res.render("login");
  } catch (error) {
    if ((error.number = 2627)) {
      res.render("signup", {
        errorMessage: "Username is already exist",
      });
    }
    console.log(error.number);
    console.log(error.message);
  }
};

module.exports = {
  getLoginPage,
  getSignupPage,
  login,
  signUp,
};
