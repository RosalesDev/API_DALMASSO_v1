import { sign } from "jsonwebtoken";
import { getConnection } from "../database/database";

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const connection = await getConnection();
    
  
    let [results, fields] = await connection.query(
      "SELECT * FROM usuarios WHERE mail = ?",
      [email]
    );

    // Si no se encuentra en 'usuarios', buscar en 'clientesweb'
    if (results.length === 0) {
      [results, fields] = await connection.query(
        "SELECT * FROM clientes_web WHERE Mail = ?", 
        [email]
      );
    }

    
    if (results.length === 0) {
      return res.status(401).json({ error: "El usuario no existe." });
    }

    const user = results[0];

    
    if (password !== user.Clave) { 
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

   
    const userRole = user.IdCliente ? "clientweb" : "administrator";

   
    const token = sign(
      {
        userId: user.IdCliente || user.IdUsuario, 
        userName: user.Nombre, 
        SucursalDefault: user.SucursalDefault,
        IdVendedor: user.IdVendedor,
        userRole: userRole  
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error en la consulta de login:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export const methods = {
  login,
};
