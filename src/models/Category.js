import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: false // Optional field for category image URL
  },
  trips: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trips' // Associating category with multiple trips
  }],
  isActive: {
    type: Boolean,
    default: true // Default to true, allows disabling categories if needed
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;