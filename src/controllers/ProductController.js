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

const getAllProductsAndByName = async (req, res) => {
  try {
    const productList = await productService.getAllProductsAndByName(req);
    res.json(productList);
  } catch (error) {
    res.status(500).json({ error: "Error fetching product names" });
  }
};

export const methods = {
  getProductListByKeyword,
  getAllProductsAndByName,
  getProductById,
  getProductByNumber,
};
