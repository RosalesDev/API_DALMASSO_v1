import express from "express";
import morgan from "morgan";
import loginRoutes from "./routes/Login";
import usersRoutes from "./routes/Users";
import productRoutes from "./routes/Products";
import customerRoutes from "./routes/Customers";
import cors from "cors";

const app = express();
app.use(cors());

app.set("port", 3000);

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/login", loginRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);

export default app;
