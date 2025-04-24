import express from 'express';
import {
  addImage,
  getTripImages,
  deleteImage
} from '../controllers/imageController.js';

import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only super admins can add or delete images
router.post('/', verifyToken, checkRole(['super_admin','admin']), addImage);
router.delete('/:id', verifyToken, checkRole(['super_admin','admin']), deleteImage);

// Public - view images for a specific trip
router.get('/trip/:tripId', getTripImages);

export default router;