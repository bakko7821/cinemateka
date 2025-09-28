import mongoose, { Schema, Document } from "mongoose";

export interface IReview {
  id: string;
  text: string;
  rating: number;
  createdAt: Date;
}

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  image?: string;
  reviews: IReview[];
}

const reviewSchema = new Schema<IReview>({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 10 },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  image: { type: String, default: "" },
  reviews: { type: [reviewSchema], default: [] },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
