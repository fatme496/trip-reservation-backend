import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  caption: {
    type: String,
    trim: true
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trips',
    required: true
  }
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);
export default Image;