import { getConnection } from "../database/database";

const getCustomerById = async (req) => {
  try {
    let { customerId } = req.params;
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      `SELECT clientes.*, ctacte.Fecha AS FECHA_SALDO, ctacte.Debe, clientes.ExentoIIBB, clientes.IVA_Tipo FROM clientes
      LEFT JOIN ctacte ON ctacte.IdCliente = clientes.IdCliente
      WHERE clientes.IdCliente = ?
      ORDER BY ctacte.Fecha DESC LIMIT 1`,
      customerId
    );
    return results;
  } catch (error) {
    console.log("Error en la consulta:", error);
    return error.message;
  }
};



const getCustomerByNumber = async (req) => {
  try {
    let { customerNumber } = req.params;
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      `SELECT clientes.*, ctacte.Fecha AS FECHA_SALDO, ctacte.Debe, clientes.ExentoIIBB, clientes.IVA_Tipo FROM clientes
      LEFT JOIN ctacte ON ctacte.IdCliente = clientes.IdCliente
      WHERE clientes.numero = ?
      ORDER BY ctacte.Fecha DESC LIMIT 1`,
      customerNumber
    );
    return results;
  } catch (error) {
    console.log("Error en la consulta:", error);
    return error.message;
  }
};



const getAllCustomerNames = async () => {
  try {
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      "SELECT IdCliente, nombre, ExentoIIBB, IVA_Tipo FROM clientes"
    );
    return results;
  } catch (error) {
    console.log("Error en la consulta:", error);
    return error.message;
  }
};


const getCustomerByName = async (req) => {
  try {
    let { keyword } = req.params;
    keyword = "%" + keyword + "%";
    console.log("queryKeyword:", keyword);
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      "SELECT IdCliente, Nombre, ExentoIIBB, IVA_Tipo FROM clientes WHERE nombre like ?",
      keyword
    );
    return results;
  } catch (error) {
    console.log("Error en la consulta:", error);
    return error.message;
  }
};



export const methods = {
  getCustomerById,
  getCustomerByNumber,
  getAllCustomerNames,
  getCustomerByName,
};
