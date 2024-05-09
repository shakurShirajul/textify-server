import express from "express";
import { database } from "./database/mongodb.js";

const app = express();
const PORT = process.env.PORT || 5000;

database();

// Middlewares
app.use(express.json());

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})