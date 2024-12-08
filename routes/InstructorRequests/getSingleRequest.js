// routes/instructors.js
const express = require('express');
const Instructor = require('../../models/InstructorRequests');
const router = express.Router();
const mongoose = require('mongoose');

// GET endpoint to fetch one requests
router.get('/admin-single-requests/:requestID', async (req, res) => {

    const { requestID } = req.params

    try {

        // Retrieve one Request from the database

        const objectId = new mongoose.Types.ObjectId(requestID);

        const request = await Instructor.findById(objectId);

        // Respond with the fetched data
        res.status(200).json({ message: 'Requests retrieved successfully', request });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Failed to retrieve requests', error });
    }
});

module.exports = router;
