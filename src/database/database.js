import mysql from 'mysql2/promise';
import config from '../config';

const createConnection = async () => {
  return mysql.createConnection({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
  });
};

export const getConnection = async () => {
  return createConnection();
};

export default {
  getConnection,
};
