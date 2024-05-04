import { getConnection } from "../database/database";

const getUsers = async (req, res) => {
  try {
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      "SELECT IdUsuario,Nombre,Mail FROM usuarios"
    );
    res.json(results);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      "SELECT IdUsuario,Nombre,Mail FROM usuarios WHERE IdUsuario = ?",
      uid
    );
    res.json(results);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

// const addUsers = async (req, res) => {
//   try {
//     const { idalias, mail } = req.body;

//     if (idalias === undefined || mail === undefined) {
//       res.status(400).json({ message: "Bad Request. Please fill all field." });
//     }

//     const Users = { idalias, mail };
//     const connection = await getConnection();
//     await connection.query("INSERT INTO usuarios SET ?", Users);
//     res.json({ message: "User added" });
//   } catch (error) {
//     res.status(500);
//     res.send(error.message);
//   }
// };

export const methods = {
  getUsers,
  getUser,
  // addUsers,
};
