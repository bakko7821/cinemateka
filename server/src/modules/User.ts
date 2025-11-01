import mongoose, { Schema, Document } from "mongoose";

export interface IReview {
  filmId: mongoose.Types.ObjectId;
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
  subscribe: boolean;
  createdAt: Date;
  image?: string;
  reviews: IReview[];
  favorites: mongoose.Types.ObjectId[];
  followersCount: number; // новое поле
}


const reviewSchema = new Schema<IReview>({
  filmId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Film", 
    required: true 
  },
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
  subscribe: { type: Boolean, required: false, default: false },
  createdAt: { type: Date, default: Date.now },
  image: { type: String, default: "" },
  reviews: { type: [reviewSchema], default: [] },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }], // подписки
  followersCount: { type: Number, default: 0 }, // добавляем сюда
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
