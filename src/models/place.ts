import { Schema, model } from 'mongoose';

interface Place {
  name: string,
  photo: string,
}

const PlaceSchema = new Schema<Place>({
  name: { type: String, required: true },
  photo: { type: String, required: true },
}, { versionKey: false });

export default model<Place>('Place', PlaceSchema);
