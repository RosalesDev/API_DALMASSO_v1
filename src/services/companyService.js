import { getConnection } from "../database/database";

const getCompanies = async (req) => {
  try {
    const connection = await getConnection();
    const [results, fields] = await connection.query(
      "SELECT CodEmpresa, Nombre,Referencia, Numero FROM empresas"
    );
    return results;
  } catch (error) {
    console.log("Error en la consulta de sucursales:", error);
    return error.message;
  }
};

export const methods = {
  getCompanies,
};
