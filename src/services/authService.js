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

    // Si no se encuentra en 'usuarios_web', buscar en 'clientes_web.'
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


    let userRole = user.Rol || "clienteWeb";

    const token = sign(
      {
        userId: user.IdCliente || user.IdVendedor,
        userName: user.Nombre,
        SucursalDefault: user.SucursalDefault,
        IdVendedor: user.IdVendedor,
        IdCliente: user.IdCliente,
        userRole: user.Rol,
        VerSaldo: Number(user.VerSaldo) || 0,
        VerPresupuesto: Number(user.VerPresupuesto) || 0,
        VerPrecios: Number(user.VerPrecios) || 0,  // <-- unificado
        VerDescuento: Number(user.VerDescuento) || 0,
        AgregarCarrito: Number(user.AgregarCarrito) || 0
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );


    console.log({
      userId: user.IdCliente || user.IdVendedor,
      userName: user.Nombre,
      SucursalDefault: user.SucursalDefault,
      IdVendedor: user.IdVendedor,
      userRole: user.Rol,  
      IdCliente: user.IdCliente,
      VerPrecios: user.VerPrecios || 0,
      VerSaldo: user.VerSaldo || 0,
      VerPresupuesto: user.VerPresupuesto || 0,
      VerDescuento: user.VerDescuento || 0,
      AgregarCarrito: user.AgregarCarrito || 0,
    });

    // console.log("Token generado:", token);

    res.json({ token });
  } catch (error) {
    console.error("Error en la consulta de login:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export const methods = {
  login,
};
