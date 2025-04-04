import mysql from "mysql2/promise";
import config from "../config";

const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const getConnection = () => {
  return pool;
};

module.exports = {
  getConnection,
};
