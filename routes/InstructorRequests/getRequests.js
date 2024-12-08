// routes/instructors.js
const express = require('express');
const Instructor = require('../../models/InstructorRequests');
const router = express.Router();

// GET endpoint to fetch all instructor requests
router.get('/admin-requests', async (req, res) => {
    try {
        // Retrieve all instructors from the database
        const instructors = await Instructor.find();

        // Respond with the fetched data
        res.status(200).json({ message: 'Requests retrieved successfully', instructors });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Failed to retrieve requests', error });
    }
});

module.exports = router;
