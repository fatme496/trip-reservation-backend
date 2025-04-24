import express from 'express';
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public - anyone can view categories
router.get('/', getAllCategories);

// Protected - only super_admin can create, update, or delete
router.post('/', verifyToken, checkRole(['super_admin']), createCategory);
router.put('/:id', verifyToken, checkRole(['super_admin']), updateCategory);
router.delete('/:id', verifyToken, checkRole(['super_admin']), deleteCategory);

export default router;