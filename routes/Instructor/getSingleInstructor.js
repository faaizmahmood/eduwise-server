const express = require('express');
const Instructors = require('../../models/Instructors');
const router = express.Router();
const mongoose = require('mongoose');

// GET endpoint to fetch a single instructor
router.get('/single-instructor/:userID', async (req, res) => {
    const { userID } = req.params;

    try {
        // Validate userID format
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ message: 'Invalid userID format' });
        }

        // Retrieve the instructor by userId
        const instructor = await Instructors.findOne({ userId: userID }); // Adjust this based on your schema

        // Check if the instructor exists
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        // Respond with the fetched data
        res.status(200).json({ message: 'Instructor retrieved successfully', instructor });
    } catch (error) {
        console.error('Error fetching instructor:', error);
        res.status(500).json({ message: 'Failed to retrieve instructor', error });
    }
});

module.exports = router;
