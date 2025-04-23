import Reservation from '../models/reservation.js';
import Trip from '../models/Trip.js';
// Create a reservation
export const createReservation = async (req, res) => {
  try {
    const { trip_id, num_guests, notes } = req.body;
    const user_id = req.user.id;

    // Check if the trip exists
    const trip = await Trip.findById(trip_id);
    if (!trip) {
      return res.status(400).json({ message: "Trip not found" });
    }

    const reservation = new Reservation({
      user_id,
      trip_id,
      num_guests,
      notes
    });

    const savedReservation = await reservation.save();
    res.status(201).json({ data: savedReservation, message: "Reservation created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating reservation", error: error.message });
  }
};

// Get all reservations
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('user_id trip_id');
    res.status(200).json({ data: reservations, message: "Reservations retrieved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error: error.message });
  }
};

// Get a reservation by ID
export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('user_id trip_id');
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json({ data: reservation, message: "Reservation retrieved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservation", error: error.message });
  }
};

// Update a reservation by ID
export const updateReservation = async (req, res) => {
  try {
    const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json({ data: updated, message: "Reservation updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating reservation", error: error.message });
  }
};

// Delete a reservation by ID
export const deleteReservation = async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reservation", error: error.message });
  }
};