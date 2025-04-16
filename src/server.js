import express from "express";
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import tripRoutes from './routes/tripRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

app.get("/", (req, res) => {
  res.send("Trip reservation API is running");
});
app.use('/api/trips', tripRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));