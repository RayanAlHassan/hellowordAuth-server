import express from "express";
import { addUser, loginUser } from "../Controlller/User.js";

const userRoutes=express.Router()

userRoutes.post("/register",addUser);
userRoutes.post("/login",loginUser);

export default userRoutes;