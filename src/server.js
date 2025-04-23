import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import tripRoutes from './routes/tripRoutes.js';
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoutes.js';
import authRoutes from "./routes/authRoutes.js";

import reservationRoutes from './routes/reservationRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));