// routes/admin.js
const express = require('express');
const router = express.Router();
const Instructor = require('../../models/Instructors'); // Adjust model path if needed
const Courses = require('../../models/courses'); // Assuming a separate model for courses

// GET endpoint to fetch instructor data
router.get('/admin-instructors', async (req, res) => {
    try {
        // Fetch all instructors
        const instructors = await Instructor.find({});

        // Prepare data to include the required information
        const instructorData = await Promise.all(
            instructors.map(async (instructor) => {
                
                // Fetch courses uploaded by the instructor

                const courses = await Courses.find({ 'instructor.id': instructor._id });

                const totalCourses = courses.length;

                // Calculate total reviews and star ratings
                const totalReviews = courses.reduce((acc, course) => acc + (course.ratings?.reviews?.length || 0), 0);
                
                const averageRating = courses.length
                    ? (courses.reduce((acc, course) => acc + (course.ratings?.average_rating || 0), 0) / courses.length).toFixed(1)
                    : 0;

                return {
                    id: instructor._id,
                    fullName: `${instructor.fName} ${instructor.lName}`,
                    email: instructor.email,
                    totalCourses,
                    totalReviews,
                    averageRating: averageRating ? `${averageRating} Stars` : 'No Ratings',
                };
            })
        );

        // Respond with the formatted data
        res.status(200).json({
            message: 'Instructors retrieved successfully',
            instructors: instructorData,
        });
    } catch (error) {
        console.error('Error fetching instructor data:', error);
        res.status(500).json({ message: 'Failed to retrieve instructors', error });
    }
});

module.exports = router;
