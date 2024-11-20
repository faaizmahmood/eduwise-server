const express = require('express');
const router = express.Router();
const Course = require('../../../models/courses');

// Endpoint: Get a single course by ID
router.get('/singleCourse/:courseID', async (req, res) => {
    try {
        const courseID = req.params.courseID; // Extract the course ID from the URL
        const singleCourse = await Course.findById(courseID); // Find course by ID

        if (!singleCourse) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.status(200).json(singleCourse); // Send the course data
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.error(error);
    }
});

module.exports = router;
