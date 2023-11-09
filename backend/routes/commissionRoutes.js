import express from "express";
const router = express.Router();

import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";

// POST: Split commission after the user verified successfully.
// Only for admin/sponser.

// Function to calculate the splitting of commission.
const splitCommissions = async (user, amount, levels, percentages) => {
  if (!user || levels === 0) {
    return;
  }

  const commission = (percentages[0] / 100) * amount;
  const sponser = await User.findById(user.sponser);

  if (sponser) {
    if (sponser.children.length >= 4) {
      sponser.earning = sponser.earning + commission;
    } else if (sponser.children.length === 2 && percentages[0] === 8) {
      sponser.earning = sponser.earning + commission;
    } else if (sponser.children.length === 3 && percentages[0] === 7) {
      sponser.earning = sponser.earning + commission;
    } else {
      sponser.unrealisedEarning.push(commission);
    }

    await sponser.save();
    splitCommissions(sponser, amount, levels - 1, percentages.slice(1));
  }
  
};

// POST: Split commission after the user verified successfully.
// Only for Super admin.
router.post(
  "/split-commission",
  protect,
  asyncHandler(async (req, res) => {
    const sponserUserId = req.user._id;

    const { userId } = req.body;

    //NEW
    const sponser = await User.findById(sponserUserId);

    const sponseredUsers = await User.findById(sponserUserId).populate({
      path: "children",
    });

    const theUser = sponseredUsers.children.find((child) =>
      child._id.equals(userId)
    );

    const packageSelected = await theUser.populate({
      path: "packageChosen",
    });

    //NEW
    const percentages = [8, 7, 5, 4, 3, 2, 1];
    //NEW
    const levels = Math.min(percentages.length, 7);
    const packageAmount = packageSelected.packageChosen.amountExGST;

    //NEW
    const sponserCommission = (25 / 100) * packageAmount;
    sponser.earning = sponser.earning + sponserCommission;
    await sponser.save();

    splitCommissions(sponser, packageAmount, levels, percentages);

    return res
      .status(200)
      .json({ message: "Commissions splitted successfully" });
  })
);

// Withdraw earnings
// POST: Access to admin/logged in user
router.post(
  "/widthdraw",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const requestAmount = req.body;

    const user = await User.findById(userId);

    if (user) {
      const earning = user.earning;

      if (earning < 500) {
        res.status(400);
        throw new Error(
          `You wallet amount is not enough to withdraw. You need atleast ₹500! Current wallet amount is ${earning}`
        );
      } else if (earning < requestAmount) {
        res.status(400);
        throw new Error(
          `You don't have enough balance in your wallet! Current wallet amount is ${earning}`
        );
      } else {
      }
    }
  })
);

export default router;
