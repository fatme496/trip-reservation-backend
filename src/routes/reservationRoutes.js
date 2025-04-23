import express from 'express';
import {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation
} from '../controllers/reservationController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new reservation
router.post('/', verifyToken, createReservation);

// Get all reservations
router.get('/', verifyToken, checkRole(['super_admin', 'admin']), getAllReservations);

// Get a reservation by ID
router.get('/:id', verifyToken, getReservationById);

// Update a reservation by ID
router.put('/:id', verifyToken, updateReservation);

// Delete a reservation by ID
router.delete('/:id', verifyToken, checkRole(['super_admin', 'admin']), deleteReservation);

export default router;