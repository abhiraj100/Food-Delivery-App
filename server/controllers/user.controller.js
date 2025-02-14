import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

// Function to create token
const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
// register user

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // checking is user already exists
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validate strong password
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1,
      })
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain a number, uppercase letter, and special character",
      });
    }

    // if (password.length < 8) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Please enter a strong password",
    //   });
    // }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // generate token
    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while registering the user",
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Compare password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password or invalid credentials",
      });
    }

    // Generate token
    const token = createToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
};

export { loginUser, registerUser };
