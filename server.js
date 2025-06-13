import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import userRoutes from "./Routs/User.js"
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/user", userRoutes); 


const PORT = process.env.PORT;

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is Running, and App is listening on port " + PORT);
  } else {
    console.log("Error: ", error);
  }
});
