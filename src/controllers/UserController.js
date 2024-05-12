import { methods as userService } from "../services/userService";

const getUserList = async (req, res) => {
  const userList = await userService.getUserList();
  res.json(userList);
};

const getUserById = async (req, res) => {
  const user = await userService.getUserById(req);
  res.json(user);
};

export const methods = {
  getUserList,
  getUserById,
};
