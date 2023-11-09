import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    sponser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    packageChosen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    ownSponserId: {
      type: String,
      required: true,
    },
    screenshot: {
      type: String,
    },
    referenceNo: {
      type: String,
    },
    earning: {
      type: Number,
      default: 0,
    },
    unrealisedSalary: {
      type: Number,
      default: 0
    },
    unrealisedEarning: [
      {
        type: Number
      },
    ],
    userStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Doing encryption before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
