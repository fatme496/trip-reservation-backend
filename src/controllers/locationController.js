import Location from '../models/Location.js';

// Create Location
export const createLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json({
      data: location,
      message: "Location created successfully"
    });
  } catch (error) {
    res.status(400).json({
      data: null,
      message: "Failed to create location",
      error: error.message
    });
  }
};

// Get All Locations
export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json({
      data: locations,
      message: "Locations retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "Error retrieving locations",
      error: error.message
    });
  }
};

// Get Location by ID
export const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({
        data: null,
        message: "Location not found"
      });
    }
    res.status(200).json({
      data: location,
      message: "Location retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "Error retrieving location",
      error: error.message
    });
  }
};

// Update Location
export const updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      data: location,
      message: "Location updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      data: null,
      message: "Failed to update location",
      error: error.message
    });
  }
};

// Delete Location
export const deleteLocation = async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.status(200).json({
      data: null,
      message: "Location deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "Failed to delete location",
      error: error.message
    });
  }
};