import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   token = req.cookies.jwt;

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.userId);
//       next();
//     } catch (error) {
//       console.log(error);
//       res.status(401);
//       throw new Error("Not authorized");
//     }
//   } else {
//     res.status(401);
//     throw new Error("No token found, Not authorized");
//   }
// });

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authenticated, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authenticated, No token");
  }
});

// const superAdmin = asyncHandler(async (req, res, next) => {
//   let token;

//   token = req.cookies.jwt;

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.userId);
//       if (req.user.isSuperAdmin) {
//         next();
//       } else {
//         res.status(401);
//         throw new Error(
//           "You are not autherized as Super admin. Please check again!"
//         );
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(401);
//       throw new Error("Not authorized");
//     }
//   } else {
//     res.status(401);
//     throw new Error("No token found, Not authorized");
//   }
// });

const superAdmin = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (req.user.isSuperAdmin) {
        next();
      } else {
        console.error(error);
        res.status(401);
        throw new Error("Not recognized as Super admin, token failed");
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authenticated, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authenticated, No token");
  }
});

export { protect, superAdmin };
