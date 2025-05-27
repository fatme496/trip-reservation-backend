import express from 'express';
import {
  createReservation,
  // getMyReservations,
  getAllReservations,
  getReservationById,
  updateReservation,
  //deleteReservation,
  getUserReservations,
  cancelReservation,
  getUserReservation
} from '../controllers/reservationController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new reservation
router.post('/', verifyToken, createReservation);

// router.get('/',verifyToken, getMyReservations);
router.get('/user', verifyToken, getUserReservations);

// Get all reservations
router.get('/', verifyToken, checkRole(['super_admin', 'admin']), getAllReservations);

// Get a reservation by ID
router.get('/:id', verifyToken, getReservationById);

// Get current user's reservation for a specific trip
router.get('/user/:tripId', verifyToken, getUserReservation);

// Update a reservation by ID
router.put('/:id', verifyToken, updateReservation);

// Delete a reservation by ID
// router.delete('/:id', verifyToken, checkRole(['super_admin', 'admin']), deleteReservation);

router.delete('/:id',verifyToken, cancelReservation);

export default router;