const express = require("express");
const path = require("path");
const { encode } = require("html-entities");
const {
  verifyPassword,
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

const login = async (req, res) => {
  const uname = encode(req.body.uname);
  const password = encode(req.body.password);

  const db_res = await getPool()
    .request()
    .input("uname", sql.VarChar, uname)
    .query(
      `SELECT password FROM Users WHERE uname = @uname AND status = 'active'`
    );

  if (db_res.recordset.length === 0) {
    return res.render("login", {
      errorMessage: "Username not found. Please try again",
    });
  }

  const { password: hash } = db_res.recordset[0];

  if (!verifyPassword(password, hash)) {
    return res.render("login", {
      errorMessage: "Incorrect password. Please try again",
    });
  }

  req.session.uname = uname;
  req.session.isAuth = true;
  await req.session.save();

  res.redirect("/login");
};

const signUp = async (req, res) => {
  try {
    const uname = encode(req.body.uname);
    const password = encode(req.body.password);
    const email = encode(req.body.email);

    const validUname = validator.isAlphanumeric(uname);
    const validPassword = validatePassword(password);
    const validEmail = validator.isEmail(email);

    if (validPassword) {
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

    const { hash } = await encryptPassword(password);
    const db_res = await getPool()
      .request()
      .input("uname", sql.VarChar, uname)
      .input("password", sql.VarChar, hash)
      .input("email", sql.VarChar, email)
      .query(
        `IF NOT EXISTS (SELECT 1 FROM users WHERE uname = @uname)
        BEGIN
          INSERT INTO users (uname, password, email, date, status) VALUES (@uname, @password, @email, GETDATE(), 'active');
        END`
      );

    if (db_res.rowsAffected.length === 0) {
      return res.render("signup", {
        errorMessage: "Username is already exist",
      });
    }

    return res.render("login");
  } catch (error) {
    console.log(error);
  }
};

const logout = () => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

const isAuth = (req, res, next) => {
  if (!req.session.isAuth) {
    return res.redirect("/login");
  }
  next();
};

module.exports = {
  getLoginPage,
  getSignupPage,
  login,
  signUp,
  isAuth,
  logout,
};
