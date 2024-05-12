import { getConnection } from "../database/database";

const getUserList = async () => {
  try {
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      "SELECT IdUsuario,Nombre,Mail FROM usuarios"
    );
    return results;
  } catch (error) {
    console.log("Error en la consulta:", error);
    return error.message;
  }
};

const getUserById = async (req) => {
  try {
    const { userId } = req.params;
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      "SELECT IdUsuario,Nombre,Mail FROM usuarios WHERE IdUsuario = ?",
      userId
    );
    return results;
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const methods = {
  getUserList,
  getUserById,
};
