import express from "express";
import morgan from "morgan";
import loginRoutes from "./routes/Login";
import usersRoutes from "./routes/Users";
import productRoutes from "./routes/Products";
import customerRoutes from "./routes/Customers";
import authenticateToken from "./middleware/authMiddleware";


const cors =require('cors');

const app = express();
app.use(cors());

app.set("port", 3000);

app.use(morgan("dev"));
app.use(express.json());
// hola

app.use("/api/login", loginRoutes);
app.use("/api/users", authenticateToken, usersRoutes);
app.use("/api/products", authenticateToken, productRoutes);
app.use("/api/customers", authenticateToken, customerRoutes);

export default app;
