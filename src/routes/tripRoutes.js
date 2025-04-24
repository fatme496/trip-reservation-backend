import express from 'express';
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip
} from '../controllers/tripController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for managing trips
router.get('/', verifyToken, getTrips);  // Get all trips
router.get('/:tripId', verifyToken, getTripById);  // Get trip by ID
router.post('/', verifyToken, checkRole(['admin', 'super_admin']), createTrip);  // Create a new trip
router.put('/:tripId', verifyToken, checkRole(['admin', 'super_admin']), updateTrip);  // Update trip by ID
router.delete('/:tripId', verifyToken, checkRole(['admin', 'super_admin']), deleteTrip);  // Delete trip by ID

export default router;