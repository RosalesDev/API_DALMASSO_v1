import { methods as customerService } from "../services/customerService";

const getCustomerById = async (req, res) => {
  const customer = await customerService.getCustomerById(req);
  res.json(customer);
};

const getCustomerByNumber = async (req, res) => {
  const customer = await customerService.getCustomerByNumber(req);
  res.json(customer);
};

const getAllCustomerNames = async (req, res) => {
  const customerNameList = await customerService.getAllCustomerNames();
  res.json(customerNameList);
};

const getCustomerByName = async (req, res) => {
  const customerList = await customerService.getCustomerByName(req);
  res.json(customerList);
};

export const methods = {
  getCustomerById,
  getCustomerByNumber,
  getAllCustomerNames,
  getCustomerByName,
};
