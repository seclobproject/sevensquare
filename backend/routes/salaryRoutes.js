import express from "express";
const router = express.Router();

import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";

// Check if the descendants are fulfulled the criteria of filling atleast 4 children
const checkDescendants = async (user) => {
  if (!user) {
    return 0;
  }

  const getUser = await User.findById(user);

  if (getUser.children.length < 4) {
    return 0;
  }

  let totalChildren = Math.min(getUser.children.length, 4);

  for (let i = 0; i < 4; i++) {
    totalChildren += await checkDescendants(getUser.children[i]);
  }

  return totalChildren;
};

// Withdraw salary if the user fulfilled the criteria
const withdrawSalary = async (user, amount) => {
  user.earning = user.earning + amount;

  await user.save();
};

router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId);

    const totalChildren = await checkDescendants(user);

    if (totalChildren === 340) {
      if (user.unrealisedSalary >= 5000) {
        await withdrawSalary(user, 5000);
      }
    } else if (totalChildren === 1024) {
      if (user.unrealisedSalary >= 15000) {
        await withdrawSalary(user, 15000);
      }
    } else if (totalChildren === 4096) {
      if (user.unrealisedSalary >= 60000) {
        await withdrawSalary(user, 60000);
      }
    } else if (totalChildren > 4096) {
      await withdrawSalary(user, user.unrealisedSalary);
    }

    const updatedUser = await user.save();

    res.status(200).json({ updatedUser });

  })
);

export default router;
