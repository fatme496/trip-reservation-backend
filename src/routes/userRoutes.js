import express from 'express';
import { getUsers, updateUser} from '../controllers/userController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only super admins can access these admin-related routes
router.get('/', verifyToken, checkRole(['super_admin']), getUsers);
router.put('/:id', verifyToken, checkRole(['super_admin']), updateUser);
// router.delete('/:id', verifyToken, checkRole(['super_admin']), deleteUser);

export default router;