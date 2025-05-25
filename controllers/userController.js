// controllers/userController.js

const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, age, phone, profession, email, username, password } = req.body;

    if (!name || !age || !phone || !profession || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or Username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      age,
      phone,
      profession,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    console.log(`User ${username} registered at ${newUser.createdAt}`); // Log registration time
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error.message, error.stack);
    res.status(500).json({ message: "Failed to register user", error: error.message });
  }
};

// Login User (unchanged)
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        age: user.age,
        phone: user.phone,
        email: user.email,
        profession: user.profession,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message, error.stack);
    res.status(500).json({ message: "Failed to login", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};