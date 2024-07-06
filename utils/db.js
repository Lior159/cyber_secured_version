// require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    trustServerCertificate: true,
    encrypt: true, // for Azure
    enableArithAbort: true,
  },
};

let pool;

async function connectToDatabase(onSuccess) {
  try {
    if (!pool) {
      pool = await new sql.ConnectionPool(config).connect();
      console.log("Connected to the database!");
    }
    return pool;
  } catch (err) {
    console.error("Database connection failed: ", err.message);
    throw err;
  }
}

function getPool() {
  return pool;
}

module.exports = {
  config,
  connectToDatabase,
  getPool,
};
