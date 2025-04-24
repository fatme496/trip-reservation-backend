// routes/tripRoutes.js
import express from 'express';
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from '../controllers/tripController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/trips - Create a new trip
router.post('/',verifyToken, checkRole(['super_admin', 'admin']), createTrip);

// GET /api/trips - Get all trips
router.get('/', getAllTrips);

// GET /api/trips/:id - Get a specific trip by ID
router.get('/:id', getTripById);

// PUT /api/trips/:id - Update a trip
router.put('/:id',verifyToken, checkRole(['super_admin', 'admin']), updateTrip);

// DELETE /api/trips/:id - Delete a trip
router.delete('/:id',verifyToken, checkRole(['super_admin', 'admin']), deleteTrip);

export default router;