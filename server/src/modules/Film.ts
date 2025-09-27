import mongoose, { Document, Schema } from "mongoose";

export interface IFilm extends Document {
  title: string;
  year: number;
  poster: string;
  genres: string[];
}

const FilmSchema = new Schema<IFilm>({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  poster: { type: String, required: true },
  genres: { type: [String], required: true },
});

FilmSchema.index({ title: 1, year: 1 }, { unique: true });

export default mongoose.model<IFilm>("Film", FilmSchema);
