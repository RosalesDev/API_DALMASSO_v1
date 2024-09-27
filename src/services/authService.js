import { sign } from "jsonwebtoken";
import { getConnection } from "../database/database";

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const connection = await getConnection();

    let [results, fields] = await connection.query(
      "SELECT * FROM usuarios_web WHERE mail = ?",
      [email]
    );

    // Si no se encuentra en 'usuarios_web', buscar en 'clientes_web'
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

    // Verificar la contraseña
    if (password !== user.Clave) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Obtener el rol directamente desde la columna 'Rol' de la base de datos
    let userRole = user.Rol || "clienteWeb";

    const token = sign(
      {
        userId: user.IdCliente || user.IdVendedor,
        userName: user.Nombre,
        SucursalDefault: user.SucursalDefault,
        IdVendedor: user.IdVendedor,
        userRole: user.Rol,
        IdCliente: user.IdCliente
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    console.log({
      userId: user.IdCliente || user.IdVendedor,
      userName: user.Nombre,
      SucursalDefault: user.SucursalDefault,
      IdVendedor: user.IdVendedor,
      userRole: user.Rol,  // Debe coincidir con la columna de la base de datos
      IdCliente: user.IdCliente
    });

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
