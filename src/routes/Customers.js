import { Router } from "express";
import { methods as customerController } from "../controllers/CustomerController";

const router = Router();

router.get("/customer-names", customerController.getAllCustomerNames);
router.get("/search/by-name/:keyword", customerController.getCustomerByName);
router.get("/search/by-id/:customerId", customerController.getCustomerById);
router.get("/search/by-number/:customerNumber",customerController.getCustomerByNumber);



export default router;
