import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    githubId: String,
    name: String,
    avatar: String,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
