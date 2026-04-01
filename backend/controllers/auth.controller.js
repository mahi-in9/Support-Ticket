const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

// Generate JWT with role
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

// @desc Register User
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    let { title, email, password } = req.body;

    // Normalize email
    email = email.toLowerCase();

    // Validate
    if (!email || !password || !title) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password (async)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default role is USER
    const user = await User.create({
      title,
      email,
      password: hashedPassword,
      role: "USER",
    });

    const token = generateToken(user);

    // Remove password before sending
    const { password: _, ...safeUser } = user.toObject();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: safeUser,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc Login User
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = generateToken(user);

    const { password: _, ...safeUser } = user.toObject();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUser,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc Get Logged-in User
// @route GET /api/auth/me
const getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Create Admin User (Seed endpoint - use with care)
// @route POST /api/auth/seed-admin
const seedAdmin = async (req, res) => {
  try {
    const { email, password, title, secretKey } = req.body;

    // Simple secret key check
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({
        success: false,
        message: "Invalid secret key",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      title,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "ADMIN",
    });

    const { password: _, ...safeAdmin } = admin.toObject();

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      user: safeAdmin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUser,
  seedAdmin,
};