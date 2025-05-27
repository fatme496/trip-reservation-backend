import express from 'express';
import {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation
} from '../controllers/locationController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getLocations);
router.get('/:id', verifyToken, getLocationById);
router.post('/', verifyToken, createLocation);
router.put('/:id', verifyToken, updateLocation);
router.delete('/:id', verifyToken, deleteLocation);

export default router;