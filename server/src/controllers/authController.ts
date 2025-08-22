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

// ENHANCED DEBUG VERSION - Request reset token
export const forgotPassword = async (req: Request, res: Response) => {
  console.log("🔥 FORGOT PASSWORD ENDPOINT HIT!");
  console.log("📨 Request body:", req.body);
  console.log("📨 Request headers:", req.headers);
  
  try {
    const { email } = req.body;
    
    console.log("📧 Extracted email:", email);
    console.log("📧 Email type:", typeof email);
    console.log("📧 Email length:", email ? email.length : 'undefined');
    
    // Enhanced validation with detailed logging
    if (!email) {
      console.log("❌ Validation failed: Email is missing");
      return res.status(400).json({ 
        error: "Email is required",
        debug: "No email field in request body"
      });
    }
    
    if (typeof email !== 'string') {
      console.log("❌ Validation failed: Email is not a string");
      return res.status(400).json({ 
        error: "Email must be a string",
        debug: `Email type: ${typeof email}`
      });
    }
    
    if (!email.trim()) {
      console.log("❌ Validation failed: Email is empty after trim");
      return res.status(400).json({ 
        error: "Email cannot be empty",
        debug: "Email is empty or only whitespace"
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    console.log("🔍 Searching for user with email:", trimmedEmail);

    // Check if user exists
    const user = await User.findOne({ email: trimmedEmail });
    console.log("👤 User found:", user ? "YES" : "NO");
    
    if (!user) {
      console.log("❌ User not found in database");
      // In production, you might want to return success anyway for security
      return res.status(404).json({ 
        error: "User with this email does not exist",
        debug: `No user found with email: ${trimmedEmail}`
      });
    }

    console.log("✅ User found, generating reset token...");

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    console.log("🔑 Generated reset token:", resetToken);
    console.log("⏰ Token expires at:", new Date(resetTokenExpiry).toISOString());

    // Save token to database
    const updateResult = await User.findByIdAndUpdate(
      user._id, 
      {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry,
      },
      { new: true } // Return updated document
    );

    console.log("💾 Database update result:", updateResult ? "SUCCESS" : "FAILED");

    // Prepare response
    const response = {
      success: true,
      message: "Password reset token generated successfully",
      resetToken: resetToken,
      debug: {
        userId: user._id,
        email: trimmedEmail,
        tokenGenerated: true,
        tokenLength: resetToken.length,
        expiresIn: "1 hour"
      }
    };

    console.log("📤 Sending response:", response);

    res.status(200).json(response);

  } catch (error: any) {
    console.error("💥 FORGOT PASSWORD ERROR:", error);
    console.error("💥 Error stack:", error.stack);
    
    res.status(500).json({
      error: "Failed to process password reset request",
      debug: {
        message: error.message,
        stack: error.stack
      }
    });
  }
};

// ENHANCED DEBUG VERSION - Reset password
export const resetPassword = async (req: Request, res: Response) => {
  console.log("🔥 RESET PASSWORD ENDPOINT HIT!");
  console.log("📨 Request body:", req.body);
  
  try {
    const { email, resetToken, newPassword } = req.body;
    
    console.log("📧 Email:", email);
    console.log("🔑 Reset token:", resetToken);
    console.log("🔒 New password length:", newPassword ? newPassword.length : 'undefined');
    
    // Validation
    if (!email || !email.trim()) {
      console.log("❌ Email validation failed");
      return res.status(400).json({ 
        error: "Email is required",
        debug: "Email is missing or empty"
      });
    }
    
    if (!resetToken || !resetToken.trim()) {
      console.log("❌ Reset token validation failed");
      return res.status(400).json({ 
        error: "Reset token is required",
        debug: "Reset token is missing or empty"
      });
    }
    
    if (!newPassword || !newPassword.trim()) {
      console.log("❌ New password validation failed");
      return res.status(400).json({ 
        error: "New password is required",
        debug: "New password is missing or empty"
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedToken = resetToken.trim();

    console.log("🔍 Looking for user with email and valid token...");
    console.log("🔍 Email:", trimmedEmail);
    console.log("🔍 Token:", trimmedToken);
    console.log("🔍 Current time:", new Date().toISOString());

    // Find user with valid token
    const user = await User.findOne({
      email: trimmedEmail,
      resetPasswordToken: trimmedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    console.log("👤 User with valid token found:", user ? "YES" : "NO");
    
    if (!user) {
      console.log("❌ No user found with valid token");
      // Let's also check if user exists without token validation
      const userExists = await User.findOne({ email: trimmedEmail });
      console.log("👤 User exists in DB:", userExists ? "YES" : "NO");
      
      if (userExists) {
        console.log("🔑 User's current token:", userExists.resetPasswordToken);
        console.log("⏰ User's token expiry:", userExists.resetPasswordExpires);
        console.log("⏰ Token expired?", userExists.resetPasswordExpires && userExists.resetPasswordExpires < new Date());
      }
      
      return res.status(400).json({ 
        error: "Invalid or expired reset token",
        debug: {
          userExists: !!userExists,
          currentTime: new Date().toISOString(),
          providedToken: trimmedToken
        }
      });
    }

    console.log("✅ Valid user and token, updating password...");

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

    // Update password and remove reset token
    const updateResult = await User.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        $unset: { 
          resetPasswordToken: 1, 
          resetPasswordExpires: 1 
        },
      },
      { new: true }
    );

    console.log("💾 Password update result:", updateResult ? "SUCCESS" : "FAILED");

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      debug: {
        userId: user._id,
        email: trimmedEmail,
        passwordUpdated: true,
        tokenCleared: true
      }
    });

  } catch (error: any) {
    console.error("💥 RESET PASSWORD ERROR:", error);
    console.error("💥 Error stack:", error.stack);
    
    res.status(500).json({
      error: "Failed to reset password",
      debug: {
        message: error.message,
        stack: error.stack
      }
    });
  }
};