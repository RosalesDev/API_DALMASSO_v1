import { sign } from "jsonwebtoken";
import { getConnection } from "../database/database";

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const connection = await getConnection();
    
    // Buscar el usuario en la tabla 'usuarios'
    let [results, fields] = await connection.query(
      "SELECT * FROM usuarios WHERE mail = ?",
      [email]
    );

    // Si no se encuentra en 'usuarios', buscar en 'clientesweb'
    if (results.length === 0) {
      [results, fields] = await connection.query(
        "SELECT * FROM clientesweb WHERE Mail = ?", 
        [email]
      );
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "El usuario no existe." });
    }

    const user = results[0];

    // Verificar la contraseña
    if (password !== user.Clave) { 
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Determinar el rol del usuario basado en si tiene 'IdVendedor'
    const userRole = user.IdVendedor ? "admin" : "clienteWeb";

    // Crear el token con el rol correcto
    const token = sign(
      {
        userId: user.IdCliente || user.IdVendedor,  // Asegúrate de que 'IdCliente' o 'IdVendedor' esté correcto para tu sistema
        userName: user.Nombre,
        SucursalDefault: user.SucursalDefault,
        IdVendedor: user.IdVendedor,
        userRole: userRole,
        IdCliente: user.IdCliente  // Añadir IdCliente explícitamente
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Depurar el token generado
    console.log("Token generado:", token);

    res.json({ token });
  } catch (error) {
    console.error("Error en la consulta de login:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export const methods = {
  login,
};
