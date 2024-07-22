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

    /*
    Esto debería compararse contra un hash almacenado en la db.
    Por ahora lo dejamos asi para no tocarles las claves que tienen
    */

    if (password !== user.Clave) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = sign({ userId: user.id, userName: user.Nombre }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    res.json({ token });
  } catch (error) {
    console.log("Error en la consulta de login:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export const methods = {
  login,
};
