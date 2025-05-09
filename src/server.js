import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import tripRoutes from './routes/tripRoutes.js';
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoutes.js';
import authRoutes from "./routes/authRoutes.js";

import reservationRoutes from './routes/reservationRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import locationRoutes from './routes/locationRoutes.js';

dotenv.config();
const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000", 
   "https://trip-in-lebanon.vercel.app", 
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,  
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect DB
connectDB();

app.get("/", (req, res) => {
  res.send("Trip reservation API is running");
});
app.use('/api/trips', tripRoutes);
app.use("/api/users", authRoutes);
app.use('/api/admin', userRoutes);

app.use('/api/reservations', reservationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/locations', locationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));