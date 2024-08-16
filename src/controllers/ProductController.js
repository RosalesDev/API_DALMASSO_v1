import { methods as productService } from "../services/productService";

const getProductById = async (req, res) => {
  const product = await productService.getProductById(req);
  res.json(product);
};

const getProductByNumber = async (req, res) => {
  const product = await productService.getProductByNumber(req);
  res.json(product);
};

const getProductListByKeyword = async (req, res) => {
  const productList = await productService.getProductListByKeyword(req);
  res.json(productList);
};

const getAllProductNames = async (req, res) => {
  try {
    const productNamesList = await productService.getAllProductNames();
    res.json(productNamesList);
  } catch (error) {
    res.status(500).json({ error: "Error fetching product names" });
  }
};

export const methods = {
  getProductListByKeyword,
  getAllProductNames,
  getProductById,
  getProductByNumber,
};
