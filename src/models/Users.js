import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "super_admin"] }, // role can be 'user', 'admin', etc.
  }
);

export const User = mongoose.model('User', userSchema);

// Fetch all users
export const getAllUsers = async () => {
  try {
    const users = await User.find({});
    return users;
  } catch (err) {
    throw err;
  }
};

// Delete user by ID
export const deleteUserById = async (id) => {
  try {
    const result = await User.findByIdAndDelete(id);
    return result;
  } catch (err) {
    throw err;
  }
};

// Update user details
export const updateUserById = async (id, updatedFields) => {
  if (Object.keys(updatedFields).length === 0) {
    throw new Error("No fields to update");
  }

  try {
    const result = await User.findByIdAndUpdate(id, updatedFields, { new: true });
    return result;
  } catch (err) {
    throw err;
  }
};

// Fetch a user by ID
export const getUserById = async (id) => {
  try {
    const user = await User.findById(id, "id name email role");
    return user;
  } catch (err) {
    throw err;
  }
};