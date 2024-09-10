import { sign } from "jsonwebtoken";
import { getConnection } from "../database/database";

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      "SELECT * FROM usuarios WHERE mail = ?",
      email
    );

    if (results.length === 0) {
      return res.status(401).json({ error: "El usuario no existe." });
    }
    const user = results[0];

    // Comparar la contraseña (esto debería ser un hash en un entorno de producción)
    if (password !== user.Clave) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    
    const token = sign(
      {
        userId: user.id, 
        userName: user.Nombre, 
        SucursalDefault: user.SucursalDefault,
        IdVendedor: user.IdVendedor
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "8h" }
    );

    res.json({ token });
  } catch (error) {
    console.log("Error en la consulta de login:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export const methods = {
  login,
};
