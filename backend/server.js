import express from "express";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

import userRoutes from './routes/userRoutes.js';

//dotenv
import dotenv from "dotenv";
dotenv.config();
//dotenv

import cookieParser from "cookie-parser";

// Database connection
import connectDB from "./config/db.js";
connectDB();
// Database connection

app.use(express.json());
app.use(cookieParser());

// API Points
app.get("/", (req, res) => {
  res.status(201).json('Running');
});

app.use("/api/users", userRoutes);
// API Points

app.use(errorHandler);
app.use(notFound);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running in ${port}`));
