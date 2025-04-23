// controllers/tripController.js
import Trip from '../models/Trip.js';

// Create a new trip
export const createTrip = async (req, res) => {
    try {
        const newTrip = new Trip(req.body);
        const savedTrip = await newTrip.save();
        res.status(201).json(
            {
                data: savedTrip,
                message: "trip created successfully"
            });
    } catch (error) {
        res.status(500).json({
            message: "Error creating trip",
            error: error.message
        });
    }
};

// Get all trips
export const getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find();
        res.status(200).json({
            data: trips,
            message: "Trips retrieved successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Trips cannot be displayed",
            error: error.message
        });
    }
};

// Get a single trip by ID
export const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        res.status(200).json({
            data: trip,
            message: "Trip retrieved successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Trip cannot be displayed",
            error: error.message
        });
    }
};

// Update a trip
export const updateTrip = async (req, res) => {
    try {
        const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedTrip) return res.status(404).json({ message: 'Trip not found' });
        res.status(200).json({
            data: updatedTrip,
            message: "Trip updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while updating the trip",
            error: error.message
        });
    }
};

// Delete a trip
export const deleteTrip = async (req, res) => {
    try {
        const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
        if (!deletedTrip) return res.status(404).json({ message: 'Trip not found' });
        res.status(200).json({ data: deleteTrip, message: 'Trip deleted successfully' });
    } catch (error) {
        res.status(500).json({ 
            message: "An error occurred while deleting the trip",
            error: error.message });
    }
};