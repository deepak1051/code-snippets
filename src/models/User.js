import mongoose from "mongoose";

const userTypes = {
  USER: "USER",
  ADMIN: "ADMIN",
};

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    githubId: String,
    name: String,
    avatar: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: userTypes.USER,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
