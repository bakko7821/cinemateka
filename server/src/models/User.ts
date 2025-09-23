import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true, unique: false },
  lastname: { type: String, required: true, unique: false },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  image: { type: String, default: "" },
});

const User = mongoose.model("User", userSchema);
export default User;
