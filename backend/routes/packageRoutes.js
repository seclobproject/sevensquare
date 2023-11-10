import express from "express";
const router = express.Router();

import asyncHandler from "../middleware/asyncHandler.js";
import { protect, superAdmin } from "../middleware/authMiddleware.js";

import Package from "../models/packageModel.js";

// GET: All packages
// Access to all users
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const packages = await Package.find();

    if (packages) {
      res.json(packages);
    } else {
      res.status(404).json({ message: "Packages not found!" });
    }
  })
);

// POST: Create a new package
// Access only to super admin
router.post(
  "/add-new-package",
  protect,
  superAdmin,
  asyncHandler(async (req, res) => {
    // const userId = req.user._id;

    const { name, amount, amountExGST, usersCount, addOnUsers, schemeType } =
      req.body;

    // const user = User.findById({ userId });

    // if (!user) {
    //   res.status(404);
    //   throw new Error("User not found. Check if you are logged in!");
    // }

    // const existingPackages = await Package.findOne({ user: userId });

    const newPackage = {
      name,
      amount,
      amountExGST,
      usersCount,
      addOnUsers,
      schemeType,
    };

    // if (existingPackages) {
    //   existingPackages.packages.push(newPackage);
    //   await existingPackages.save();
    //   res.status(200).json({ message: "New package added!!!" });
    // } else {
    // res.status(200).json({ message: "Package added successfully!!!" });
    // }

    const addNewPackage = await Package.create({
      name,
      amount,
      amountExGST,
      usersCount,
      addOnUsers,
      schemeType,
    });

    res.status(200).json({ message: "Package added successfully!!!" });
  })
);

// PUT: Edit package
// Access to superadmin
router.put(
  "/edit-package",
  superAdmin,
  asyncHandler(async (req, res) => {
    const {
      _id,
      name,
      amount,
      amountExGST,
      usersCount,
      addOnUsers,
      schemeType,
    } = req.body;

    const updatePackage = await Package.findByIdAndUpdate(_id, {
      name,
      amount,
      amountExGST,
      usersCount,
      addOnUsers,
      schemeType,
    });

    // if (getPackage) {
    //   getPackage.name = name;
    //   getPackage.amount = amount;
    //   getPackage.amountExGST = amountExGST;
    //   getPackage.usersCount = usersCount;
    //   getPackage.addOnUsers = addOnUsers;
    //   getPackage.schemeType = schemeType;
    // }

    // const updatePackage = await getPackage.save();

    if (updatePackage) {
      res.status(200).json({
        name,
        amount,
        amountExGST,
        usersCount,
        addOnUsers,
        schemeType,
      });
    } else {
      res
        .status(404)
        .json({ message: "Some unkwon error occured! Please try again!" });
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

    if (packageToDelete.modifiedCount === 1) {
      res.status(200).json({ message: "Package deleted successfully!!!" });
    }
  })
);

export default router;
