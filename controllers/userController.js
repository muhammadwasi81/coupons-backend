import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { email, instagramHandle, password } = req.body;

    if (!email || !instagramHandle || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({
      $or: [{ email }, { instagramHandle }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      instagramHandle,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { emailOrInstagram, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (!emailOrInstagram) {
      return res
        .status(400)
        .json({ message: "Email or Instagram handle is required" });
    }

    // Check if the input is an email or Instagram handle
    const isEmail = emailOrInstagram.includes("@");

    let user;
    if (isEmail) {
      user = await User.findOne({ email: emailOrInstagram });
    } else {
      user = await User.findOne({ instagramHandle: emailOrInstagram });
    }

    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      userId: user._id,
      email: user.email,
      instagramHandle: user.instagramHandle,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    console.error("Get Me error:", error);
    res
      .status(500)
      .json({ message: "Error fetching user data", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, instagramHandle, currentPassword, newPassword } = req.body;
    console.log(req.body);
    if (!email && !instagramHandle && !newPassword) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateFields = {};

    if (email) updateFields.email = email;
    if (instagramHandle) updateFields.instagramHandle = instagramHandle;

    if (email || instagramHandle) {
      const existingUser = await User.findOne({
        $or: [
          { email: email, _id: { $ne: userId } },
          { instagramHandle: instagramHandle, _id: { $ne: userId } },
        ],
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email or Instagram handle already in use" });
      }
    }

    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password is required to update password" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};
