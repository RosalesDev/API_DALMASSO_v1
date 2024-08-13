import { Router } from "express";
import { methods as productController } from "../controllers/ProductController";
import { addBuget, addBugetItems } from "../services/addProduct";

const router = Router();

router.get("/product-names", productController.getAllProductNames);
router.get(
  "/search/by-name/:keyword",
  productController.getProductListByKeyword
);
router.get("/search/by-id/:productId", productController.getProductById);
router.get(
  "/search/by-number/:productNumber",
  productController.getProductByNumber
);


router.post('/presupuestos', addBuget); 
router.post('/presupuestos_articulos', addBugetItems); 

export default router;
