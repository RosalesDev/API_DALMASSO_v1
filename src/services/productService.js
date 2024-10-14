import { getConnection } from "../database/database";

const getProductById = async (req) => {
  try {
    let { productId } = req.params;
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      `SELECT p.*, 
              p.Activo, 
              p.ProdVenta,
              ROUND(precios_venta.precio, 2) AS precio, 
              precios_venta.moneda, 
              ROUND(cotizacionmoneda.cotizacion, 2) AS cotizacion
       FROM p
       JOIN precios_venta ON precios_venta.IdProducto = p.IdProducto
       JOIN cotizacionmoneda ON cotizacionmoneda.codmoneda = precios_venta.moneda
       WHERE p.IdProducto = ?
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
      `SELECT p.*, 
              p.Activo, 
              p.ProdVenta,
              ROUND(precios_venta.precio, 2) AS precio, 
              precios_venta.moneda, 
              ROUND(cotizacionmoneda.cotizacion, 2) AS cotizacion
       FROM p
       JOIN precios_venta ON precios_venta.IdProducto = p.IdProducto
       JOIN cotizacionmoneda ON cotizacionmoneda.codmoneda = precios_venta.moneda
       WHERE p.numero = ?
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
    console.log("queryKeyword:", keyword);
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      "SELECT IdProducto, Nombre FROM p WHERE nombre LIKE ?",
      [keyword]
    );
    return results;
  } catch (error) {
    console.log("Error en la consulta:", error);
    return error.message;
  }
};

const getAllProductsAndByName = async (req) => {
  const { term, limit = 20, page = 1 } = req.query;
  const offset = (page - 1) * limit;
  const normalizedSearch = term.replace(/[^a-zA-Z0-9]/g, "");
  let query = `SELECT p.IdProducto,
              p.Numero,
              p.nombre,
              p.Activo,
              p.ProdVenta, 
              ROUND(precios_venta.precio, 2) AS precio, 
              precios_venta.moneda,
              CASE
                WHEN precios_venta.moneda != 1 THEN ROUND((select cotizacion from cotizacionmoneda where codmoneda = precios_venta.moneda ORDER BY fecha DESC LIMIT 1), 2)
                ELSE 1
              END AS 'cotizacion'
       FROM productos p
       INNER JOIN precios_venta ON precios_venta.IdProducto = p.IdProducto
       WHERE precios_venta.idlista = 2`;

  const queryParams = [];
  if (normalizedSearch) {
    query += ` AND (REPLACE(p.nombre, '-', '') LIKE ? OR REPLACE(p.Numero, '-', '') LIKE ?)`;
    queryParams.push(`%${normalizedSearch}%`, `%${normalizedSearch}%`);
  }

  queryParams.push(Number(limit), Number(offset));

  try {
    const connection = await getConnection();
    console.log("params: ", queryParams);
    const [results, fields] = await connection.query(
      `${query} LIMIT ? OFFSET ?`,
      queryParams,
      (err, results) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.json(results);
      }
    );
    return {
      currentPage: Number(page),
      count: results.length, // Número de resultados en esta página
      data: results, // Los productos encontrados
    };
  } catch (error) {
    console.log("Error en la consulta:", error);
    return error.message;
  }
};

export const methods = {
  getProductListByKeyword,
  getAllProductsAndByName,
  getProductById,
  getProductByNumber,
};
