import express from "express";
const router = express.Router();
import Randomstring from "randomstring";

import asyncHandler from "../middleware/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/fileUploadMiddleware.js";

// Register new user
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const sponser = req.user.ownSponserId;

    const ownSponserId = Randomstring.generate(7);

    const {
      name,
      email,
      phone,
      address,
      packageChosen,
      password,
      isAdmin,
      isSuperAdmin,
      userStatus,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("User already exists!");
    }

    const user = await User.create({
      sponser,
      name,
      email,
      phone,
      address,
      packageChosen,
      password,
      isAdmin,
      isSuperAdmin,
      ownSponserId,
      userStatus,
    });

    if (user) {
      // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      //   expiresIn: "1d",
      // });

      // res.cookie("jwt", token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV !== "development",
      //   sameSite: "strict",
      //   maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      // });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        sponser: user.sponser,
        ownSponserId: user.ownSponserId,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        userStatus: user.userStatus,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  })
);

// Login user/admin
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  })
);

// POST: User verification
// After first/fresh user login
router.post(
  "/verify-user",
  protect,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const { referenceNo } = req.body;

    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user) {
      user.screenshot = req.file.originalname;
      user.referenceNo = referenceNo;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(401);
      throw new Error("User not found");
    }
  })
);

// GET: All users to Super admin
router.get(
  "/get-users",
  protect,
  asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
  })
);

//GET: All users to admin (under that specific admin with his referralID)
router.get(
  "/get-my-users",
  protect,
  asyncHandler(async (req, res) => {

    const sponser = req.user.ownSponserId;

    const users = await User.find({sponser});
    res.json(users);
    
  })
);

// Logout user
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
  })
);

export default router;
