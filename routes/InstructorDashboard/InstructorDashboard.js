const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../../models/courses');

router.get('/instructor-dashboard/:InstructorID', async (req, res) => {
    try {
        const { InstructorID } = req.params;

        // Validate InstructorID
        if (!mongoose.Types.ObjectId.isValid(InstructorID)) {
            return res.status(400).json({ error: 'Invalid Instructor ID' });
        }

        // Fetch all courses created by the instructor
        const courses = await Course.find({ 'instructor.id': InstructorID });

        if (!courses || courses.length === 0) {
            return res.status(404).json({ error: 'No courses found for this instructor' });
        }

        // Calculate total courses
        const totalCourses = courses.length;

        // Calculate total enrollments
        const totalEnrollments = courses.reduce(
            (sum, course) => sum + (course.enrollment?.current_enrolled || 0),
            0
        );

        // Calculate completion rate (students who left reviews)
        const totalCompletions = courses.reduce(
            (sum, course) => sum + (course.ratings?.reviews?.length || 0),
            0
        );

        const completionRate = totalEnrollments > 0
            ? ((totalCompletions / totalEnrollments) * 100).toFixed(2)
            : 0;

        // Fetch the latest 4-5 reviews from all courses
        const latestReviews = courses
            .flatMap(course => course.ratings?.reviews || [])
            .slice(0, 5);

        // Response object
        const dashboardData = {
            totalCourses,
            totalEnrollments,
            completionRate,
            latestReviews,
        };

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Error fetching instructor dashboard data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
