// routes/tripRoutes.js
import express from 'express';
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from '../controllers/tripController.js';

const router = express.Router();

// POST /api/trips - Create a new trip
router.post('/', createTrip);

// GET /api/trips - Get all trips
router.get('/', getAllTrips);

// GET /api/trips/:id - Get a specific trip by ID
router.get('/:id', getTripById);

// PUT /api/trips/:id - Update a trip
router.put('/:id', updateTrip);

// DELETE /api/trips/:id - Delete a trip
router.delete('/:id', deleteTrip);

export default router;