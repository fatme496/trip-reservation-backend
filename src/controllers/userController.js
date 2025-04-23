import {
    getAllUsers,
    deleteUserById,
    updateUserById,
    getUserById
} from "../models/Users.js";

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json({
            data: users,
            message: "Users retrieved successfully"
        });
    } catch (err) {
        res.status(500).json({
            data: null,
            message: "Users cannot be displayed",
            error: err.message
        });
    }
};

// Delete a user
// export const deleteUser = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const hasReservations = await hasUserReservations(id);
//         if (hasReservations) {
//             return res.status(400).json({
//                 data: null,
//                 message: "Cannot delete user. They have active or past reservations."
//             });
//         }

//         const hasReviews = await hasUserReviews(id);
//         if (hasReviews) {
//             return res.status(400).json({
//                 data: null,
//                 message: "Cannot delete user. They have posted reviews or comments."
//             });
//         }

//         await deleteUserById(id);
//         res.json({
//             data: null,
//             message: "User deleted successfully"
//         });
//     } catch (err) {
//         res.status(500).json({
//             data: null,
//             message: "Error deleting user",
//             error: err.message
//         });
//     }
// };

// Update user details
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    let updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (role) updatedFields.role = role;

    try {
        await updateUserById(id, updatedFields);
        const updatedUser = await getUserById(id);

        if (!updatedUser) {
            return res.status(404).json({
                data: null,
                message: "User not found after update"
            });
        }

        res.json({
            data: updatedUser,
            message: "User updated successfully"
        });
    } catch (err) {
        res.status(500).json({
            data: null,
            message: "An error occurred while updating the user",
            error: err.message
        });
    }
};