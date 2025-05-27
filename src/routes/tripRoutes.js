import express from 'express';
import {
  createTrip,
  getTrips,
  searchTripsByTitle,
  searchTrips,
  getTripById,
  updateTrip,
  deleteTrip
} from '../controllers/tripController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for managing trips
router.get('/', getTrips);  // Get all trips
router.get('/search', searchTripsByTitle);
router.get('/filter/search', searchTrips);
router.get('/:tripId', getTripById);  // Get trip by ID
router.post('/', verifyToken, createTrip);  // Create a new trip
router.put('/:tripId', verifyToken, updateTrip);  // Update trip by ID
router.delete('/:tripId', verifyToken, deleteTrip);  // Delete trip by ID

export default router;