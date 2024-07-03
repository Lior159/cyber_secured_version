const { encode } = require("html-entities");
const {
  verifyPassword,
  encryptPassword,
  validatePassword,
} = require("../pass_config");
const sql = require("mssql");
const { getPool } = require("../db");
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

module.exports = {
  getPasswordUpdatePage,
  updatePassword,
};
