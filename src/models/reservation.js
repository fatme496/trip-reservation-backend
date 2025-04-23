import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trips',
    required: true
  },
  reserved_at: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  num_guests: {
    type: Number,
    default: 1
  },
  total_price: {
    type: Number
  },
  payment_status: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  notes: {
    type: String
  }
});

export default mongoose.model('Reservation', reservationSchema);