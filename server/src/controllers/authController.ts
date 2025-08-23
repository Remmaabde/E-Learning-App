import User from "../models/user";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Login controller
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Request reset token - FIXED VERSION
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  
  try {
    // Validate input
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(404).json({ error: "User with this email does not exist" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save token to user document
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    });

    console.log(`Reset token generated for ${email}: ${resetToken}`); // Debug log

    // Return the token in the response (in production, you'd send via email)
    res.json({
      success: true,
      message: "Password reset token generated successfully",
      resetToken: resetToken, // This is what your frontend expects
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      error: "Failed to process password reset request",
      details: error.message,
    });
  }
};

// Reset password - FIXED VERSION
export const resetPassword = async (req: Request, res: Response) => {
  const { email, resetToken, newPassword } = req.body;
  
  try {
    // Validate input
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!resetToken || !resetToken.trim()) {
      return res.status(400).json({ error: "Reset token is required" });
    }
    if (!newPassword || !newPassword.trim()) {
      return res.status(400).json({ error: "New password is required" });
    }

    console.log(`Password reset attempt for ${email} with token: ${resetToken}`); // Debug log

    
    const user = await User.findOne({
      email: email.trim(),
      resetPasswordToken: resetToken.trim(),
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("No user found with valid token"); 
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }


    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

    
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      $unset: { 
        resetPasswordToken: 1, 
        resetPasswordExpires: 1 
      },
    });

    console.log(`Password successfully reset for ${email}`); 

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    res.status(500).json({
      error: "Failed to reset password",
      details: error.message,
    });
  }
};