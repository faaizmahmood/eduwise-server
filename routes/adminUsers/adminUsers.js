// routes/instructors.js
const express = require('express');
const Users = require('../../models/auth');
const router = express.Router();
const mongoose = require('mongoose');

// GET endpoint to fetch one requests
router.get('/admin-users', async (req, res) => {

    try {

        // Retrieve one Request from the database

        const appUsers = await Users.find({});

        const response = appUsers.map((user, index) => ({
            id: user._id || 'N/A', // Assuming `_id` is the unique identifier
            fullName: `${user.fName} ${user.lName}` || 'N/A', // Assuming `firstName` and `lastName` fields
            email: user.email || 'N/A', // Email field (default to empty string if not present)
            phone: user.phone_number || 'N/A', // Phone number field (default to empty string if not present)
            userName: user?.username || `N/A`, // Generate if not present
            totalEnrolledCourses: user.current_courses?.length || 0, // Assuming `enrolledCourses` is an array
            totalCompletedCourses: user.completed_courses?.length || 0, // Assuming `completedCourses` is an array
        }));

        // Respond with the fetched data
        res.status(200).json({
            message: 'Users retrieved successfully',
            data: response,
        });

    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Failed to retrieve requests', error });
    }
});

module.exports = router;
