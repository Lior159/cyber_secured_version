const { getPool } = require("../utils/db");
const { encode } = require("html-entities");
const sql = require("mssql");
const validator = require("validator");

const getNewCustomerPage = (req, res) => {
  res.render("create_customer");
};

const createCustomer = async (req, res) => {
  try {
    const id = encode(req.body.id).trim();
    const full_name = encode(req.body.full_name).trim();
    const email = encode(req.body.email).trim();
    const phone = encode(req.body.phone).trim();
    const birth_date = encode(req.body.birth_date).trim();
    const gender = encode(req.body.gender).trim();
    const street = encode(req.body.street).trim();
    const city = encode(req.body.city).trim();
    const post_code = encode(req.body.post_code).trim();
    const created_by = req.session.uname;

    const isValidInput = validateCustomer({
      id,
      full_name,
      email,
      phone,
      birth_date,
      gender,
      street,
      city,
      post_code,
    });

    if (isValidInput) {
      return res.render("create_customer", {
        errorMessage: isValidInput,
      });
    }

    const db_res = await getPool()
      .request()
      .input("id", sql.VarChar, id)
      .input("full_name", sql.NVarChar, full_name)
      .input("email", sql.VarChar, email)
      .input("phone", sql.VarChar, phone)
      .input("birth_date", sql.VarChar, birth_date)
      .input("gender", sql.VarChar, gender)
      .input("street", sql.NVarChar, street)
      .input("city", sql.NVarChar, city)
      .input("post_code", sql.VarChar, post_code)
      .input("created_by", sql.VarChar, created_by)
      .query(
        `IF NOT EXISTS (SELECT 1 FROM customers WHERE id = @id)
        BEGIN
          INSERT INTO customers (id, full_name, email, phone, birth_date, gender, street, city, post_code, created_by)
          VALUES (@id, @full_name, @email, @phone, @birth_date, @gender, @street, @city, @post_code, @created_by);
        END`
      );

    if (db_res.rowsAffected.length === 0) {
      return res.render("create_customer", {
        errorMessage: "Customer is already exist",
      });
    }

    return res.render("new_customer", {
      full_name,
      id,
      email,
      phone,
      birth_date: new Intl.DateTimeFormat("en-GB").format(new Date(birth_date)),
      gender,
      street,
      city,
      post_code,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internavl server error");
  }
};

const validateCustomer = ({
  id,
  full_name,
  email,
  phone,
  birth_date,
  gender,
  street,
  city,
  post_code,
}) => {
  try {
    if (!validateID(id)) {
      return "Invalid ID";
    }

    if (
      !validator.isAlpha(full_name.replace(" ", ""), "he") &&
      !validator.isAlpha(full_name.replace(" ", ""), "en-US")
    ) {
      return "Invald Full Name, must contain only Hebrow or English letters)";
    }

    if (!validator.isEmail(email)) {
      return "Invalid Email";
    }

    if (!validator.isMobilePhone(phone, "he-IL")) {
      return "Invalid Phone Number";
    }

    if (!validator.isDate(birth_date)) {
      return "Invalid Birth Date";
    }

    if (gender !== "male" && gender !== "female") {
      return "Invalid Gender";
    }

    if (
      !validator.isAlphanumeric(street.replace(" ", ""), "he") &&
      !validator.isAlphanumeric(street.replace(" ", ""), "en-US")
    ) {
      return "Invalid Street Adress";
    }

    if (
      !validator.isAlpha(city.replace(" ", ""), "he") &&
      !validator.isAlpha(city.replace(" ", ""), "en-US")
    ) {
      return "Invalid City";
    }

    if (!validator.isPostalCode(post_code, "IL")) {
      return "Invalid Post code";
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internavl server error");
  }
};

const validateID = (id) => {
  try {
    if (id.length !== 9 || isNaN(id)) {
      return false;
    }
    let sum = 0,
      incNum;
    for (let i = 0; i < id.length; i++) {
      incNum = Number(id[i]) * ((i % 2) + 1); // Multiply number by 1 or 2
      sum += incNum > 9 ? incNum - 9 : incNum; // Sum the digits up and add to total
    }
    return sum % 10 === 0;
  } catch (error) {
    console.log(error);
    res.status(500).send("Internavl server error");
  }
};

module.exports = {
  getNewCustomerPage,
  createCustomer,
};
