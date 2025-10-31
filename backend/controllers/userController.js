const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ✅ Function to generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// ✅ Register new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log("🟦 Register attempt:", email);

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    console.log("❌ User already exists:", email);
    res.status(400);
    throw new Error("User already exists");
  }

  // Create new user
  const user = await User.create({ name, email, password });
  if (user) {
    console.log("✅ User registered successfully:", user.name);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    console.log("❌ Invalid user data");
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// ✅ Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("🟦 Login attempt:", email);

  const user = await User.findOne({ email });

  if (!user) {
    console.log("❌ No user found with this email");
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);
  console.log("🟨 Password match:", isMatch);

  if (isMatch) {
    console.log("✅ Login successful:", user.name);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    console.log("❌ Invalid password");
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// ✅ Get user profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// ✅ Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    console.log("🟩 Profile updated:", updatedUser.name);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};
