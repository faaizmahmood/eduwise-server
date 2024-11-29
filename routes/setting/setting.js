const express = require('express');
const router = express.Router();
const User = require('../../models/auth');

// Update user settings
router.post('/update-user', async (req, res) => {
    
    const { user_id, ...updateFields } = req.body;

    // Ensure `user_id` is provided
    if (!user_id) {
        return res.status(400).json({ status: 'Error', message: 'User ID is required.' });
    }

    try {
        // Find the user by ID and update the provided fields
        const updatedUser = await User.findOneAndUpdate(
            { _id: user_id },
            { $set: updateFields },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ status: 'Error', message: 'User not found.' });
        }

        // Successfully updated
        return res.status(200).json({
            status: 'Success',
            message: 'User updated successfully.',
            data: updatedUser
        });

    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
});

module.exports = router;
