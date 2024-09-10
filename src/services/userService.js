import { getConnection } from "../database/database";
import jwt from 'jsonwebtoken';

const generarToken = (usuario) => {
  const payload = {
    id: usuario.IdUsuario,
    userName: usuario.Nombre,
    SucursalDefault: usuario.SucursalDefault,
    IdVendedor: usuario.IdVendedor,
  };

  console.log("Payload antes de firmar el token:", payload);

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};


// Obtener la lista de usuarios
const getUserList = async (req, res) => {
  try {
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      "SELECT IdUsuario,IdVendedor,SucursalDefault, Nombre, Mail FROM usuarios"
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
      "SELECT IdUsuario, Nombre, Mail, SucursalDefault FROM usuarios WHERE IdUsuario = ?",
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
      "SELECT IdUsuario, Nombre, Mail, SucursalDefault, IdVendedor FROM usuarios WHERE IdUsuario = ?",
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



// const getCurrentUser = async (userId) => {
//   try {
//     const connection = await getConnection();
//     const [results, fields] = await connection.query(
//       "SELECT IdUsuario, Nombre, Mail FROM usuarios WHERE IdUsuario = ?",
//       [userId] 
//     );
//     if (results.length > 0) {
//       return results[0];
//     } else {
//       throw new Error("Usuario no encontrado");
//     }
//   } catch (error) {
//     throw new Error("Error al obtener información del usuario: " + error.message);
//   }
// };

export const methods = {
  getUserList,
  getUserById,
  getLoggedUser,
  // getCurrentUser,
};