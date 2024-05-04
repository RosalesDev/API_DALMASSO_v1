import express from "express";
import morgan from "morgan";

import usersRoutes from "./routes/Users";

const app = express();

app.set("port", 3000);

app.use(morgan("dev"));
app.use(express.json());
// hola

app.use("/api/users", usersRoutes);

export default app;
