// controllers/tripController.js
import Trip from '../models/Trip.js';
import Location from '../models/Location.js';

// Create a new trip
export const createTrip = async (req, res) => {
    try {
        const { title, description, locations, startDate, endDate, price } = req.body;
        const newTrip = new Trip({
            title,
            description,
            locations,
            startDate,
            endDate,
            price,
            createdBy: req.user.id  // Assuming the user is attached to the request after authentication
        });

        const trip = await newTrip.save();
        res.status(201).json({
            data: trip,
            message: "Trip created successfully"
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            message: "Failed to create trip",
            error: error.message
        });
    }
};

// Get all trips
export const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find().populate('locations');
        res.status(200).json({
            data: trips,
            message: "Trips retrieved successfully"
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            message: "Error retrieving trips",
            error: error.message
        });
    }
};

// Get a single trip by ID
export const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId).populate('locations');
        if (!trip) {
            return res.status(404).json({
                data: null,
                message: "Trip not found"
            });
        }
        res.status(200).json({
            data: trip,
            message: "Trip retrieved successfully"
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            message: "Error retrieving trip",
            error: error.message
        });
    }
};

// Update a trip by ID
export const updateTrip = async (req, res) => {
    try {
        const { title, description, locations, startDate, endDate, price } = req.body;
        const updatedTrip = await Trip.findByIdAndUpdate(
            req.params.tripId,
            { title, description, locations, startDate, endDate, price },
            { new: true }
        );

        if (!updatedTrip) {
            return res.status(404).json({
                data: null,
                message: "Trip not found"
            });
        }

        res.status(200).json({
            data: updatedTrip,
            message: "Trip updated successfully"
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            message: "Failed to update trip",
            error: error.message
        });
    }
};

// Delete a trip by ID
export const deleteTrip = async (req, res) => {
    try {
        const deletedTrip = await Trip.findByIdAndDelete(req.params.tripId);
        if (!deletedTrip) {
            return res.status(404).json({
                data: null,
                message: "Trip not found"
            });
        }
        res.status(200).json({
            data: null,
            message: "Trip deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            message: "Failed to delete trip",
            error: error.message
        });
    }
};