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
  const uname = req.session.uname;
  const inputCurPassword = encode(req.body.curPassword);
  const inputNewPassword = encode(req.body.newPassword);

  const db_res = await getPool()
    .request()
    .input("uname", sql.VarChar, uname)
    .query(
      `SELECT TOP 3 password, status FROM users
      WHERE uname = @uname
      ORDER BY date DESC 
      `
    );

  const curPassword = db_res.recordset.filter((row) => row.status === "active");

  const prevPasswords = db_res.recordset.map((row) => row.password);

  console.log(db_res);
  console.log(prevPasswords);

  const validPassword = validatePassword(inputNewPassword, prevPasswords);

  console.log(validPassword);
  // if (!validPassword) {
  //   return res.render("signup", {
  //     errorMessage: validPassword,
  //   });
  // }

  // console.log("good");
};

module.exports = {
  getPasswordUpdatePage,
  updatePassword,
};
