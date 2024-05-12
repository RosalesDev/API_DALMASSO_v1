import { getConnection } from "../database/database";

const getProductById = async (req) => {
  try {
    let { productId } = req.params;
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      `SELECT productos.*, precios_venta.precio, precios_venta.moneda FROM productos
      JOIN precios_venta ON precios_venta.IdProducto = productos.IdProducto
      WHERE productos.IdProducto = ?
      ORDER BY precios_venta.fechamod DESC LIMIT 1`,
      productId
    );
    return results;
  } catch (error) {
    console.log("Error en la consulta:", error);
    return error.message;
  }
};

const getProductByNumber = async (req) => {
  try {
    let { productNumber } = req.params;
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      `SELECT productos.*, precios_venta.precio, precios_venta.moneda FROM productos
      JOIN precios_venta ON precios_venta.IdProducto = productos.IdProducto
      WHERE productos.numero = ?
      ORDER BY precios_venta.fechamod DESC LIMIT 1`,
      productNumber
    );
    return results;
  } catch (error) {
    console.log("Error en la consulta:", error);
    return error.message;
  }
};

const getProductListByKeyword = async (req) => {
  try {
    let { keyword } = req.params;
    keyword = "%" + keyword + "%";
    console.log("queryKeyword:", keyword);
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      "SELECT IdProducto, Nombre FROM productos WHERE nombre like ?",
      keyword
    );
    return results;
  } catch (error) {
    console.log("Error en la consulta:", error);
    return error.message;
  }
};

const getAllProductNames = async () => {
  try {
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      "SELECT IdProducto,nombre FROM productos"
    );
    return results;
  } catch (error) {
    console.log("Error en la consulta:", error);
    return error.message;
  }
};

export const methods = {
  getProductListByKeyword,
  getAllProductNames,
  getProductById,
  getProductByNumber,
};
