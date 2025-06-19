import { getConnection } from "../database/database";

const getCustomerById = async (req) => {
  try {
    let { customerId } = req.params;
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      `SELECT clientes.*, ctacte.Fecha AS FECHA_SALDO, ctacte.Debe, 
              COALESCE(clientes.DescuentoHabitual, '0') AS DescuentoHabitual,
              clientes.ExentoIIBB, clientes.IVA_Tipo 
       FROM clientes
       LEFT JOIN ctacte ON ctacte.IdCliente = clientes.IdCliente
       WHERE clientes.IdCliente = ?
       ORDER BY ctacte.Fecha DESC LIMIT 1`,
      customerId
    );

    // Depuración: Verificar los datos obtenidos de la base de datos
    console.log("Datos del cliente:", results);
    console.log(
      "DescuentoHabitual:",
      typeof results[0].DescuentoHabitual,
      results[0].DescuentoHabitual
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
      `SELECT clientes.*, ctacte.Fecha AS FECHA_SALDO, ctacte.Debe,clientes.Tipo, clientes.ExentoIIBB, clientes.IVA_Tipo FROM clientes
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
      "SELECT IdCliente,Tipo, nombre,CUIT, NroDocumento, ExentoIIBB, DescuentoHabitual, IVA_Tipo FROM clientes where Tipo = 'C'"
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
      "SELECT IdCliente,Tipo, Nombre, ExentoIIBB,Domicilio, DescuentoHabitual , IVA_Tipo FROM clientes WHERE nombre like ?",
      keyword
    );
    return results;
  } catch (error) {
    console.log("Error en la consulta:", error);
    return error.message;
  }
};

const getCustomerBalanceByBranch = async (req) => {
  try {
    const { customerId } = req.params;
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      `SELECT e.Nombre AS nombreSucursal, c.sucursal, SUM(c.Debe - c.Haber) AS saldo
       FROM ctacte c
       JOIN empresas e ON c.sucursal = e.CodEmpresa
       WHERE c.IdCliente = ?
       GROUP BY c.sucursal, e.Nombre`,
      [customerId]
    );
    return results;
  } catch (error) {
    console.log("Error al obtener saldo por sucursal:", error);
    return error.message;
  }
};



export const methods = {
  getCustomerById,
  getCustomerByNumber,
  getAllCustomerNames,
  getCustomerByName,
  getCustomerBalanceByBranch,
};
