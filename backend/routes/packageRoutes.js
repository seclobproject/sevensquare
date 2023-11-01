import express from "express";
const router = express.Router();

import asyncHandler from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";

import Package from "../models/packageModel.js";
import User from "../models/userModel.js";

// POST: Create a new package
// Access only to super admin
router.post(
  "/add-new-package",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const { name, amount, amountExGST, usersCount, addOnUsers, schemeType } =
      req.body;

    const user = User.findById({ userId });

    if (!user) {
      res.status(404);
      throw new Error("User not found. Check if you are logged in!");
    }

    const existingPackages = await Package.findOne({ user: userId });

    const newPackage = {
      name,
      amount,
      amountExGST,
      usersCount,
      addOnUsers,
      schemeType,
    };

    if (existingPackages) {
      existingPackages.packages.push(newPackage);
      await existingPackages.save();

      res.status(200).json({ message: "New package added!!!" });
    } else {
      const addNewPackage = await Package.create({
        user: userId,
        packages: {
          name,
          amount,
          amountExGST,
          usersCount,
          addOnUsers,
          schemeType,
        },
      });

      res.status(200).json({ message: "Package added successfully!!!" });
    }
  })
);

// DELETE: Delete a package
// Access only to super admin
router.delete(
  "/delete-package",
  protect,
  asyncHandler(async (req, res) => {
    const { packId, packageId } = req.body;

    const packageToDelete = await Package.updateOne(
      { _id: packId },
      {
        $pull: {
          packages: { _id: packageId },
        },
      }
    );

    console.log(packageToDelete);

    if (packageToDelete) {
      res.status(200).json({ message: "Package deleted successfully!!!" });
    } else {
      console.error("Package not found or not able to update");
      res
        .status(404)
        .json({ message: "Package not found or not able to update" });
    }

  })
);

export default router;
