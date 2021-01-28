import * as mongoose from 'mongoose';

export const FacilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  streetName: { type: String, required: false },
  houseNumber: { type: String, required: false },
  flatNumber: { type: String, required: false },
  city: { type: String, required: false },
  postcode: { type: String, required: false },
  phone: { type: String, required: false },
  description: { type: String, required: false },
  longitude: { type: Number, required: false },
  latitude: { type: Number, required: false },
});
