import express from "express";
import morgan from "morgan";

import usersRoutes from "./routes/Users";
import productRoutes from "./routes/Products";
import customerRoutes from "./routes/Customers";

const app = express();

app.set("port", 3000);

app.use(morgan("dev"));
app.use(express.json());
// hola

app.use("/api/users", usersRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);

export default app;
