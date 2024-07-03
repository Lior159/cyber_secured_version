const {
  verifyPassword,
  encryptPassword,
  validatePassword,
  sendEmail,
} = require("../utils/pass_config");
const { getPool } = require("../utils/db");
const { encode } = require("html-entities");
const sql = require("mssql");
const otpGenerator = require("otp-generator");
const validator = require("validator");

const getPasswordUpdatePage = (req, res) => {
  res.render("update_password");
};

const updatePassword = async (req, res) => {
  try {
    const uname = req.session.uname;
    const inputCurPassword = encode(req.body.curPassword);
    const inputNewPassword = encode(req.body.newPassword);

    let db_res = await getPool()
      .request()
      .input("uname", sql.VarChar, uname)
      .query(
        `SELECT TOP 3 password, status, email FROM users
      WHERE uname = @uname
      ORDER BY date DESC 
      `
      );

    if (db_res.recordset.length === 0) {
      return res.render("update_password", {
        errorMessage: "Username not found. Please try again",
      });
    }

    const email = db_res.recordset[0].email;
    const [{ password: curPassword }] = db_res.recordset.filter(
      (row) => row.status === "active"
    );
    const prevPasswords = db_res.recordset.map((row) => row.password);

    if (!verifyPassword(inputCurPassword, curPassword)) {
      return res.render("update_password", {
        errorMessage: "Incorrect password. Please try again",
      });
    }

    const validPassword = validatePassword(inputNewPassword, prevPasswords);

    if (validPassword) {
      return res.render("update_password", {
        errorMessage: validPassword,
      });
    }

    const { hash } = await encryptPassword(inputNewPassword);

    db_res = await getPool()
      .request()
      .input("uname", sql.VarChar, uname)
      .input("password", sql.VarChar, hash)
      .input("email", sql.VarChar, email)
      .query(
        `UPDATE users
        SET status = 'inactive'
        WHERE uname = @uname AND status = 'active';
        INSERT INTO users (uname, password, email, date, status) VALUES (@uname, @password, @email, GETDATE(), 'active');`
      );

    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};

const getForgotPasswordPage = (req, res) => {
  res.render("forgot_password");
};

const sendOTP = async (req, res) => {
  try {
    const uname = encode(req.body.uname);

    const db_res = await getPool()
      .request()
      .input("uname", sql.VarChar, uname)
      .query(
        `SELECT email FROM users
        WHERE uname = @uname AND status = 'active'
      `
      );

    if (db_res.recordset.length === 0) {
      return res.render("forgot_password", {
        errorMessage: "Username not found. Please try again",
      });
    }

    const email = db_res.recordset[0].email;

    const otp = otpGenerator.generate(10, {
      upperCaseAlphabets: true,
      specialChars: true,
    });

    const { hash } = await encryptPassword(otp);

    await getPool()
      .request()
      .input("uname", sql.VarChar, uname)
      .input("otp", sql.VarChar, hash)
      .query(
        `UPDATE users
        SET otp = @otp, otp_expire = DATEADD(minute, 10, GETDATE())
        WHERE uname = @uname AND status = 'active';`
      );

    await sendEmail({ uname, to: email, otp });

    res.render("forgot_password", {
      successMessage: `Check your email inbox for a message from us`,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getResetPasswordPage = (req, res) => {
  const uname = encode(req.params.uname);

  return res.render("reset_password", {
    uname,
  });
};

const setNewPassword = async (req, res) => {
  const uname = encode(req.body.uname);
  const inputOtp = encode(req.body.otp);
  const newPassword = encode(req.body.newPassword);

  const db_res = await getPool()
    .request()
    .input("uname", sql.VarChar, uname)
    .query(
      `SELECT TOP 3 password, status, email,otp FROM users
      WHERE uname = @uname
      ORDER BY date DESC 
      `
    );

  if (db_res.recordset.length === 0) {
    return res.render("reset_password", {
      uname,
      errorMessage: "Invalid url - username not found",
    });
  }

  const email = db_res.recordset[0].email;
  const [{ otp }] = db_res.recordset.filter((row) => row.status === "active");
  const prevPasswords = db_res.recordset.map((row) => row.password);

  if (!otp || !verifyPassword(inputOtp, otp)) {
    return res.render("reset_password", {
      uname,
      errorMessage: "Invalid OTP",
    });
  }

  const isValidPassword = validatePassword(newPassword, prevPasswords);

  if (isValidPassword) {
    return res.render("reset_password", {
      uname,
      errorMessage: isValidPassword,
    });
  }

  const { hash } = await encryptPassword(newPassword);

  await getPool()
    .request()
    .input("uname", sql.VarChar, uname)
    .input("password", sql.VarChar, hash)
    .input("email", sql.VarChar, email)
    .query(
      `UPDATE users
        SET status = 'inactive'
        WHERE uname = @uname AND status = 'active';
        INSERT INTO users (uname, password, email, date, status) VALUES (@uname, @password, @email, GETDATE(), 'active');`
    );

  res.redirect("/login");
};

module.exports = {
  getPasswordUpdatePage,
  updatePassword,
  getForgotPasswordPage,
  sendOTP,
  getResetPasswordPage,
  setNewPassword,
};
