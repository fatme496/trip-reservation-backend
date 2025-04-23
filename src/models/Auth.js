import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/Users.js";

// Find user by email
export const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (err) {
        throw err;
    }
};

// Create a new user
export const createUser = async (name, email, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "user"
        });

        const savedUser = await newUser.save();

        return {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role
        };
    } catch (err) {
        throw err;
    }
};

// Find user by ID
export const findUserById = async (id) => {
    try {
        const user = await User.findById(id, 'id name email role');
        return user;
    } catch (err) {
        throw err;
    }
};