import mongoose, { Schema, Document } from "mongoose";

export interface IFilm extends Document {
  title: string;
  poster: string;
  genres: string[];
  createdAt: Date;
}

const FilmSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true }, // уникальное название
  poster: { type: String, required: true },
  genres: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IFilm>("Film", FilmSchema);
