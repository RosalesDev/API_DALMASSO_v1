import { getConnection } from "../database/database";
import jwt from "jsonwebtoken";

const generarToken = (usuario) => {
  const payload = {
    id: usuario.IdUsuario,
    userName: usuario.Nombre,
    SucursalDefault: usuario.SucursalDefault,
    IdVendedor: usuario.IdVendedor,
    role: usuario.role,
  };

  console.log("Payload antes de firmar el token:", payload);

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// **Nueva función: Generar enlace único para el cliente**
const generarEnlaceUnico = async (req, res) => {
  try {
    const { idCliente, dni } = req.body;

    if (!idCliente || !dni) {
      return res.status(400).json({ message: "Faltan datos necesarios" });
    }

    // Crear el token
    const payload = { idCliente, dni };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

    // Generar el enlace
    const link = `https://sistema.dalmasso.com.ar/saldo#${token}`;
    res.json({ link });
  } catch (error) {
    console.log("Error al generar el enlace:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener la lista de usuarios
const getUserList = async (req, res) => {
  try {
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      "SELECT IdUsuario,IdVendedor,SucursalDefault, Nombre, Mail FROM usuarios_web"
    );
    res.json(results);
  } catch (error) {
    console.log("Error en la consulta:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      "SELECT IdUsuario, Nombre, Mail, SucursalDefault FROM usuarios_web WHERE IdUsuario = ?",
      [userId]
    );
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.log("Error en la consulta:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener el usuario logueado (basado en el token)
const getLoggedUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    const connection = await getConnection();
    const [results] = await connection.query(
      `SELECT u.IdUsuario, u.Nombre, u.Mail, u.SucursalDefault, u.IdVendedor, e.CodEmpresa
       FROM usuarios_web u
       JOIN Empresa e ON u.IdVendedor = e.IdVendedor
       WHERE u.IdUsuario = ?`,
      [userId]
    );
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Nueva función: Obtener facturas usando el token del enlace**
const getFacturasPorEnlace = async (req, res) => {
  try {
    const { token } = req.params;

    // Verificar el token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const connection = await getConnection();
    const [results] = await connection.query(
      `SELECT f.IdFactura, f.Monto, f.Fecha
       FROM facturas f
       WHERE f.IdCliente = ?`,
      [payload.idCliente]
    );

    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ message: "No se encontraron facturas para este cliente" });
    }
  } catch (error) {
    console.log("Error al obtener facturas:", error);
    res.status(500).json({ error: error.message });
  }
};

export const methods = {
  getUserList,
  getUserById,
  getLoggedUser,
  generarEnlaceUnico, // Nueva función para generar enlaces
  getFacturasPorEnlace, // Nueva función para obtener facturas por enlace
};
