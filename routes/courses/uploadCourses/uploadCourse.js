const express = require('express');
const router = express.Router();
const Course = require('../../../models/courses'); // Assuming the course schema is in the models folder

// POST route to upload a new course
router.post('/upload-course', async (req, res) => {


    try {
        const {
            title,
            description,
            thumbnail,
            video,
            language,
            level,
            tags,
            duration,
            categories,
            instructor,
        } = req.body;

        // Create a new course document
        const newCourse = new Course({
            title,
            description,
            thumbnail,
            video,
            language,
            level,
            tags,
            duration,
            categories,
            instructor,
            enrollment: {
                current_enrolled: 0,
                enrolled_students: []
            },
            ratings: {
                average_rating: 0,
                total_reviews: 0,
                reviews: []
            }
        });

        // Save the course to the database
        const savedCourse = await newCourse.save();

        // Send a success response
        res.status(200).json({
            message: 'Course uploaded successfully!',
            course: savedCourse,
        });

    } catch (error) {
        // Handle errors (e.g., database errors)
        console.error('Error uploading course:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}
);

module.exports = router;
