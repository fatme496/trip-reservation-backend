// controllers/tripController.js
import Trip from '../models/Trip.js';
import Location from '../models/Location.js';
import Category from '../models/Category.js';

// // Create a new trip
// Create a new trip
export const createTrip = async (req, res) => {
  try {
    const {
      title,
      description,
      locations, // Array of city names
      startDate,
      endDate,
      price,
      availableSlots,
      category // Category name
    } = req.body;

    if (!title || !description || !locations?.length || !startDate || !endDate || !price || !availableSlots || !category) {
      return res.status(400).json({
        message: "All fields are required",
        data: null
      });
    }

    // Handle location creation or lookup
    const locationIds = [];
    for (const city of locations) {
      let location = await Location.findOne({ city });
      if (!location) {
        location = await Location.create({
          city,
          country: "Lebanon",
          coordinates: { lat: 0, lng: 0 }
        });
      }
      locationIds.push(location._id);
    }

    // Validate category
    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      return res.status(404).json({
        message: `Category '${category}' not found`,
        data: null
      });
    }

    // Create the trip
    const trip = new Trip({
      title,
      description,
      locations: locationIds,
      startDate,
      endDate,
      price,
      availableSlots,
      category: categoryDoc._id,
      createdBy: req.user ? req.user._id : someDefaultUserId
    });

    await trip.save();

    res.status(201).json({
      data: trip,
      message: "✅ Trip created successfully"
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "❌ Failed to create trip",
      error: error.message
    });
  }
};

// export const createTrip = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       locations,       // Array of city names
//       startDate,
//       endDate,
//       price,
//       availableSlots,
//       category          // Category name (not ID)
//     } = req.body;

//     // Ensure all locations exist or create them
//     const locationIds = [];
//     for (const city of locations) {
//       let location = await Location.findOne({ city });
//       if (!location) {
//         // Create location with default country and dummy coordinates
//         location = await Location.create({
//           city,
//           country: "Lebanon", // Default for now
//           coordinates: { lat: 0, lng: 0 } // Dummy coordinates
//         });
//       }
//       locationIds.push(location._id);
//     }

//     // Convert category name to ID
//     const categoryDoc = await Category.findOne({ name: category });
//     if (!categoryDoc) {
//       return res.status(400).json({
//         message: "Category not found",
//         data: null
//       });
//     }

//     // Create new trip
//     const trip = new Trip({
//       title,
//       description,
//       locations: locationIds,
//       startDate,
//       endDate,
//       price,
//       availableSlots,
//       category: categoryDoc._id,
//       createdBy: req.user._id
//     });

//     await trip.save();

//     res.status(201).json({
//       data: trip,
//       message: "Trip created successfully"
//     });
//   } catch (error) {
//     res.status(400).json({
//       data: null,
//       message: "Failed to create trip",
//       error: error.message
//     });
//   }
// };


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


export const searchTripsByTitle = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(200).json([]);
    }

    const regex = new RegExp(query, "i"); // case-insensitive

    // Search by title or locations (adjust field names based on your schema)
    const trips = await Trip.find({
      $or: [{ title: regex }, { description: regex }] // example fields
    }).limit(5);

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "Error searching trips",
      error: error.message,
    });
  }
};

export const getNewTrips = async (req, res) => {
  try {
    const filters = {};

    // Apply text search if filters.search exists
    if (req.query.search && req.query.search.trim() !== "") {
      const regex = new RegExp(req.query.search, "i");
      filters.$or = [{ title: regex }, { description: regex }];
    }

    // Add any other filters here...

    const trips = await Trip.find(filters).populate("locations");

    res.status(200).json({
      data: trips,
      message: "Trips retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "Error retrieving trips",
      error: error.message,
    });
  }
};


export const searchTrips = async (req, res) => {
  try {
    const { title, startDate, category, location } = req.query;

    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: 'i' }; // case-insensitive partial match
    }

    if (startDate) {
      filter.startDate = { $gte: new Date(startDate) }; // upcoming trips
    }

    if (category) {
      filter.category = category; // must be valid ObjectId
    }

    if (location) {
      filter.locations = location; // must be valid ObjectId
    }

    const trips = await Trip.find(filter)
      .populate('locations')
      .populate('category');

    res.status(200).json({
      data: trips,
      message: 'Filtered trips retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: 'Error filtering trips',
      error: error.message,
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
        const { title, description, locations, startDate, endDate, price, availableSlots, category } = req.body;

        // Find the trip first
        const trip = await Trip.findById(req.params.tripId);
        if (!trip) {
            return res.status(404).json({
                data: null,
                message: "Trip not found"
            });
        }

        // Check if the logged-in user is the creator of the trip
        if (trip.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                data: null,
                message: "Not authorized to update this trip"
            });
        }

        // Proceed with update
        const updatedTrip = await Trip.findByIdAndUpdate(
            req.params.tripId,
            { title, description, locations, startDate, endDate, price, availableSlots, category },
            { new: true }
        );

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
        // Find the trip first
        const trip = await Trip.findById(req.params.tripId);
        if (!trip) {
            return res.status(404).json({
                data: null,
                message: "Trip not found"
            });
        }

        // Check if the logged-in user is the creator of the trip
        if (trip.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                data: null,
                message: "Not authorized to delete this trip"
            });
        }

        // Proceed with deletion
        await Trip.findByIdAndDelete(req.params.tripId);

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