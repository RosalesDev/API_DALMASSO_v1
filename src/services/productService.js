import { getConnection } from "../database/database";

const getProductById = async (req) => {
  try {
    let { productId } = req.params;
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      `SELECT productos.*, 
              productos.Activo, 
              productos.ProdVenta,
              ROUND(precios_venta.precio, 2) AS precio, 
              precios_venta.moneda, 
              ROUND(cotizacionmoneda.cotizacion, 2) AS cotizacion
       FROM productos
       JOIN precios_venta ON precios_venta.IdProducto = productos.IdProducto
       JOIN cotizacionmoneda ON cotizacionmoneda.codmoneda = precios_venta.moneda
       WHERE productos.IdProducto = ?
       AND precios_venta.idlista = 2
       ORDER BY cotizacionmoneda.fecha DESC LIMIT 1`,
      [productId]
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
      `SELECT productos.*, 
              productos.Activo, 
              productos.ProdVenta,
              ROUND(precios_venta.precio, 2) AS precio, 
              precios_venta.moneda, 
              ROUND(cotizacionmoneda.cotizacion, 2) AS cotizacion
       FROM productos
       JOIN precios_venta ON precios_venta.IdProducto = productos.IdProducto
       JOIN cotizacionmoneda ON cotizacionmoneda.codmoneda = precios_venta.moneda
       WHERE productos.numero = ?
       AND precios_venta.idlista = 2
       ORDER BY cotizacionmoneda.fecha DESC LIMIT 1`,
      [productNumber]
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
    // console.log("queryKeyword:", keyword);
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      "SELECT IdProducto, Nombre FROM productos WHERE nombre LIKE ?",
      [keyword]
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
      `SELECT productos.IdProducto,
              productos.Numero,
              productos.nombre,
              productos.Activo,
              productos.ProdVenta, 
              ROUND(precios_venta.precio, 2) AS precio, 
              precios_venta.moneda,
              CASE
                WHEN precios_venta.moneda != 1 THEN ROUND((select cotizacion from cotizacionmoneda where codmoneda = precios_venta.moneda ORDER BY fecha DESC LIMIT 1), 2)
                ELSE 1
              END AS 'cotizacion'
       FROM productos
       INNER JOIN precios_venta ON precios_venta.IdProducto = productos.IdProducto
       WHERE precios_venta.idlista = 2`
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
