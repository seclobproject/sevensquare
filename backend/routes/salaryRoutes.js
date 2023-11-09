import express from "express";
const router = express.Router();

import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";

const checkDescendants = async (user) => {
  if (!user) {
    return false;
  }
  const children = await User.findById(user);

  if (children.length !== 4) {
    return false;
  }
  
  let totalChildren = children.children.length;

  for (const child of children.children) {
    totalChildren += await checkDescendants(child);
  }

  return totalChildren === 340;
};

router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user.children.length >= 4) {
    }
  })
);

export default router;
