import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trips' }] // Array of references to the Trip model
}, { timestamps: true });

const Location = mongoose.model('Location', locationSchema);
export default Location;