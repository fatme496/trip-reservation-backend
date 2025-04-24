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
router.post('/', verifyToken, checkRole(['admin', 'super_admin']), createLocation);
router.put('/:id', verifyToken, checkRole(['admin', 'super_admin']), updateLocation);
router.delete('/:id', verifyToken, checkRole(['admin', 'super_admin']), deleteLocation);

export default router;