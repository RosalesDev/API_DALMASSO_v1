// import { query } from "../database/database";
import { methods as authService } from "../services/authService";

const login = async (req, res) => {
  const loginRes = await authService.login(req, res);
  // res.json(loginRes);
};

export const methods = {
  login,
};
