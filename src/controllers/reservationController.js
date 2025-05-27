import Reservation from '../models/reservation.js';
import Trip from '../models/Trip.js';

// Create a reservation
export const createReservation = async (req, res) => {
    try {
        const { trip_id, num_guests, notes } = req.body;
        const user_id = req.user.id;

        // Validate num_guests
        if (!num_guests || num_guests < 1) {
            return res.status(400).json({ message: "Number of guests must be at least 1" });
        }

        // Check if the trip exists
        const trip = await Trip.findById(trip_id);
        if (!trip) {
            return res.status(400).json({ message: "Trip not found" });
        }

        // Check if trip has already started
        if (new Date(trip.startDate) <= new Date()) {
            return res.status(400).json({ message: "Cannot reserve a trip that has already started" });
        }

        // Check if user already reserved this trip
        const existingReservation = await Reservation.findOne({ user_id, trip_id });
        if (existingReservation) {
            return res.status(400).json({ message: "You have already reserved this trip" });
        }

        // Check if there are enough available slots
        if (trip.availableSlots < num_guests) {
            return res.status(400).json({ message: "Not enough available slots for the number of guests" });
        }

        // Create reservation
        const reservation = new Reservation({
            user_id,
            trip_id,
            num_guests,
            notes
        });

        const savedReservation = await reservation.save();

        // Update available slots in trip
        trip.availableSlots -= num_guests;
        await trip.save();

        res.status(201).json({ data: savedReservation, message: "Reservation created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating reservation", error: error.message });
    }
};


// Get all reservations for current user
// export const getMyReservations = async (req, res) => {
//     try {
//         const reservations = await Reservation.find({ user_id: req.user.id }).populate('trip_id');
//         res.json(reservations);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
export const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user_id: req.user.id })
      .populate("trip_id")
      .sort({ createdAt: -1 });

    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error: error.message });
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

export const getUserReservation = async (req, res) => {
  const userId = req.user.id; // From verifyUser middleware
  const tripId = req.params.tripId;

  try {
    const reservation = await Reservation.findOne({
      user_id: userId,
      trip_id: tripId,
    });

    if (!reservation) {
      return res.status(200).json({ data: null });
    }

    res.status(200).json({ data: reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching reservation' });
  }
};

// Update a reservation by ID
// export const updateReservation = async (req, res) => {
//   try {
//     const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ message: "Reservation not found" });
//     res.status(200).json({ data: updated, message: "Reservation updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating reservation", error: error.message });
//   }
// };

// Update reservation
export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { num_guests, notes } = req.body;

        const updated = await Reservation.findOneAndUpdate(
            { _id: id, user_id: req.user.id },
            { num_guests, notes },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: 'Reservation not found' });

        res.json({
            data: updated,
            message: "Reservation updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating reservation",
            error: error.message
        });
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

// Cancel reservation
// export const cancelReservation = async (req, res) => {
//     try {
//       const { id } = req.params;
  
//       const cancelled = await Reservation.findOneAndUpdate(
//         { _id: id, user_id: req.user.id },
//         { status: 'cancelled' },
//         { new: true }
//       );
  
//       if (!cancelled) return res.status(404).json({ message: 'Reservation not found or unauthorized' });
  
//       res.json({ message: 'Reservation cancelled', reservation: cancelled });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find reservation with trip info
    const reservation = await Reservation.findOne({ _id: id, user_id: req.user.id }).populate('trip_id');
    if (!reservation) return res.status(404).json({ message: 'Reservation not found or unauthorized' });

    // Prevent last-minute cancellations (e.g., less than 24 hours before start)
    const now = new Date();
    const cutoff = new Date(reservation.trip_id.startDate);
    cutoff.setHours(cutoff.getHours() - 24);
    if (now > cutoff) {
      return res.status(400).json({ message: "Cannot cancel less than 24 hours before the trip starts" });
    }

    // Update trip available slots
    reservation.trip_id.availableSlots += reservation.num_guests;
    await reservation.trip_id.save();

    // Delete the reservation from DB
    await Reservation.deleteOne({ _id: reservation._id });

    res.json({ message: 'Reservation cancelled and removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};