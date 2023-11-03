import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    amountExGST: {
      type: Number,
      required: true,
    },
    usersCount: {
      type: Number,
      required: true,
      default: 1,
    },
    addOnUsers: {
      type: Number,
      required: true,
      default: 0,
    },
    schemeType: {
      type: String,
      required: true,
      enum: ["staff", "franchise"],
    },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
