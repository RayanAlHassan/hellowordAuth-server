import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { error } from "console";


dotenv.config();

const USERS_FILE = path.join(process.cwd(), "users.json");

// const USERS_FILE = "../users.json";

//readt the user from the json and compaire it with the user from the front
const getUsers = () => JSON.parse(fs.readFileSync(USERS_FILE));

//save user to file
const saveUsers = (users) =>
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

//add user
export const addUser=async (req, res) => {
  const { name, email, password } = req.body;
  const users = getUsers();
  try {
    // Check if password exists and is at least 6 characters long
    if (
      !password ||
      typeof password !== "string" ||
      password.trim().length < 6
    ) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const existingUser = await users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(401).json({ error: "Email already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(password, saltRounds);

    // Create a new user object
    const newUser = {
      name,
      email,
      password: hashedPass,
    };

    // push and Save the newuser in the json array of users
    users.push(newUser);
    // Save the updated array back to users.json.
    saveUsers(users);
    res.status(200).json({ message: "User registered successfully" });

  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};




//login

export const loginUser = async (req,res)=>{
  const {email, name , password}= req.body

  const users=getUsers() //read users from json
  
  try{
    const existingUser= users.find((user)=>user.email=== email) 
    if(!existingUser){
      return res.status(404).json({ error: "User not found" });
 
    }
    const isMatch = await bcrypt.compare(password,existingUser.password)
    if(!isMatch){
return res.status(401).json({ error: "Invalid password" })
    }
    const token = jwt.sign({email:existingUser.email, name:existingUser.name},process.env.JWT_SECRET, {expiresIn: "1h"}  )
    res.json({message:"logging successful",token})
  }
  catch(error){
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
}