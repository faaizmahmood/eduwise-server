const express = require('express');
const router = express.Router();
const Course = require('../../../models/courses');

// Route to get all draft courses for a specific instructor
router.get('/drafts/:InstructorID', async (req, res) => {
    const { InstructorID } = req.params;

    try {
        // Fetch courses with status 'pending' for the specified instructor
        const response = await Course.find({
            "instructor.id": InstructorID,
            status: 'pending', // Ensure this field exists in your schema
        });

        // Return the response as JSON
        res.status(200).json({

            message: "Drafts are Retrived",
            drafts: response

        });

    } catch (error) {
        console.error('Error fetching draft courses:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;
