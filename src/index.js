import app from "./app";
import express from "express";
import cors from "cors";

const PORT = 3000;

const server = express();

server.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

server.use(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
