import express from 'express';
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new category
router.post('/', verifyToken, createCategory);

// Get all categories
router.get('/', getCategories);

// Get a category by ID
router.get('/:id', getCategoryById);

// Update a category by ID
router.put('/:id', verifyToken, checkRole(['super_admin']), updateCategory);

// Delete a category by ID
router.delete('/:id', verifyToken, checkRole(['super_admin']), deleteCategory);

export default router;