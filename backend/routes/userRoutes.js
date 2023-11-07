import express from "express";
const router = express.Router();
import Randomstring from "randomstring";

import asyncHandler from "../middleware/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/fileUploadMiddleware.js";

// Register new user
// POST: By admin/sponser

// Function to find the highest unrealised commission and add it to wallet
const unrealisedToWallet = (arr) => {
  if (arr.length === 0) {
    return 0;
  }
  const highestNumber = Math.max(...arr);
  const highestNumbers = arr.filter((num) => num === highestNumber);
  const sum = highestNumbers.reduce((acc, num) => acc + num, 0);
  return sum;
};

router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const sponser = req.user._id;
    const userStatus = "pending";

    const sponserUser = await User.findById(sponser);

    const ownSponserId = Randomstring.generate(7);

    const { name, email, phone, address, packageChosen, password, isAdmin } =
      req.body;

    const screenshot = null;
    const referenceNo = null;

    if (req.body.screenshot && req.body.referenceNo) {
      screenshot = req.body.screenshot;
      referenceNo = req.body.referenceNo;
    }

    const earning = 0;
    const unrealisedEarning = 0;
    const children = [];
    const existingUser = await User.findOne({ email });
    const existingUserByPhone = await User.findOne({ phone });

    if (existingUser || existingUserByPhone) {
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
      ownSponserId,
      screenshot,
      referenceNo,
      earning,
      unrealisedEarning,
      userStatus,
      children,
    });

    if (user) {
      if (sponserUser) {

        sponserUser.children.push(user._id);

        if (
          sponserUser.children.length === 2 ||
          sponserUser.children.length === 3
        ) {
          
          const unrealisedAmount = unrealisedToWallet(
            sponserUser.unrealisedEarning
          );

          sponserUser.earning = sponserUser.earning + unrealisedAmount;

          if (sponserUser.unrealisedEarning.length !== 0) {

            const highestNumber = Math.max(...sponserUser.unrealisedEarning);

            const remainingNumbers = sponserUser.unrealisedEarning.filter(
              (num) => num !== highestNumber
            );

            sponserUser.unrealisedEarning.length = 0;
            sponserUser.unrealisedEarning.push(...remainingNumbers);
          }
        }

        await sponserUser.save();

        res.json({
          _id: user._id,
          sponser: user.sponser,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          packageChosen: user.packageChosen,
          ownSponserId: user.ownSponserId,
          screenshot: user.screenshot,
          referenceNo: user.referenceNo,
          earning: user.earning,
          unrealisedEarning: user.unrealisedEarning,
          children: user.children,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
          userStatus: user.userStatus,
        });
      } else {
        res.status(400);
        throw new Error("Some error occured. Make sure you are logged in!");
      }
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
        sponser: user.sponser,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        packageChosen: user.packageChosen,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        ownSponserId: user.ownSponserId,
        screenshot: user.screenshot,
        referenceNo: user.referenceNo,
        earning: user.earning,
        unrealisedEarning: user.unrealisedEarning,
        userStatus: user.userStatus,
        children: user.children,
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

// Verify user by admin after the payment screenshot received
// POST: Only for admin/sponser
router.post(
  "/verify-user-payment",
  protect,
  asyncHandler(async (req, res) => {
    const sponserUserId = req.user._id;

    const { userId } = req.body;

    const sponseredUsers = await User.findById(sponserUserId).populate({
      path: "children",
    });

    const theUser = sponseredUsers.children.find((child) =>
      child._id.equals(userId)
    );

    if (theUser) {
      theUser.userStatus = "approved";

      const updatedUser = await theUser.save();
      res.status(200).json({ updatedUser });
    } else {
      res.status(401);
      throw new Error("Can't find this user. Please check again!");
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

// GET: All users to admin (under that specific admin with his referralID)
router.get(
  "/get-my-users",
  protect,
  asyncHandler(async (req, res) => {
    const sponser = req.user.ownSponserId;

    const users = await User.find({ sponser });
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
