import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser, findUserById } from "../models/Auth.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Register new user
// export const registerUser = (req, res) => {
//     const { name, email, password } = req.body;

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//         return res.status(400).json({ data: null, message: "Invalid email format" });
//     }

//     findUserByEmail(email, (err, existingUser) => {
//         if (err) return res.status(500).json({ message: "Database error", error: err.message });
//         if (existingUser) return res.status(400).json({ message: "Email already in use" });

//         createUser(name, email, password, (err, newUser) => {
//             if (err) return res.status(500).json({ message: "Error creating user", error: err.message });

//             res.status(201).json({
//                 data: newUser,
//                 message: "User registered successfully"
//             });
//         });
//     });
// };
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ data: null, message: "Invalid email format" });
    }

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const newUser = await createUser(name, email, password);
        res.status(201).json({
            data: newUser,
            message: "User registered successfully"
        });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

// Login user
// export const loginUser = (req, res) => {
//     const { email, password } = req.body;

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//         return res.status(400).json({ data: null, message: "Invalid email format" });
//     }

//     findUserByEmail(email, (err, user) => {
//         if (err) return res.status(500).json({ message: "Database error", error: err.message });
//         if (!user) return res.status(400).json({ message: "This user does not exist" });

//         bcrypt.compare(password, user.password, (err, isMatch) => {
//             if (err) return res.status(500).json({ message: "Error comparing passwords" });
//             if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

//             const token = jwt.sign(
//                 { id: user._id.toString(), role: user.role },
//                 JWT_SECRET,
//                 { expiresIn: "1h" }
//             );

//             res.cookie("token", token, {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === "production",
//                 sameSite: "Lax",
//                 maxAge: 3600000 // 1 hour
//             });

//             res.status(200).json({
//                 data: { id: user._id, name: user.name, email: user.email, role: user.role },
//                 message: "Login successful",
//                 token
//             });
//         });
//     });
// };
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ data: null, message: "Invalid email format" });
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(400).json({ message: "This user does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign(
            { id: user._id.toString(), role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 3600000
        });

        res.status(200).json({
            data: { id: user._id, name: user.name, email: user.email, role: user.role },
            message: "Login successful",
            token
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};

// Logout user
// export const logoutUser = (req, res) => {
//     res.clearCookie("token", {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "Lax"
//     });

//     res.status(200).json({ data: null, message: "Logged out successfully" });
// };
export const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax"
    });

    res.status(200).json({ data: null, message: "Logged out successfully" });
};

// Get current user
// export const getMe = (req, res) => {
//     findUserById(req.user.id, (err, user) => {
//         if (err) return res.status(500).json({ message: "Server error", error: err.message });
//         if (!user) return res.status(404).json({ message: "User not found" });

//         res.status(200).json({ data: user, message: "User retrieved successfully" });
//     });
// };
export const getMe = async (req, res) => {
    try {
        const user = await findUserById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ data: user, message: "User retrieved successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving user", error: err.message });
    }
};