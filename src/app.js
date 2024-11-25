import express from "express";
import morgan from "morgan";
import loginRoutes from "./routes/Login";
import userRoutes from "./routes/Users";
import productRoutes from "./routes/Products";
import customerRoutes from "./routes/Customers";
import companyRoutes from "./routes/Company";
import invoiceRoutes from "./routes/Invoice"
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

app.set("port", 3001);

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/login", loginRoutes);
app.use("/api", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bugets", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/invoices", invoiceRoutes); 

export default app;
