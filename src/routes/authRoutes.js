import express from 'express';
import { registerUser, loginUser, logoutUser,getMe } from "../controllers/authController.js"; 
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Define routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", verifyToken, getMe);

// Export the router so it can be used in your main server file
export default router;