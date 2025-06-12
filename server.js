import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = "./users.json";

//readt the user from the json and compaire it with the user from the front
const getUsers = () => JSON.parse(fs.readFileSync(USERS_FILE));

//save user to file
const saveUsers = (users) =>
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

//add user
app.post("/register", async (req, res) => {
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
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});
const PORT = process.env.PORT;

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is Running, and App is listening on port " + PORT);
  } else {
    console.log("Error: ", error);
  }
});
