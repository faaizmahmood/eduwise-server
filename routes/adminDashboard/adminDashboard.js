const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../../models/courses');
const User = require('../../models/auth');
const InstructorRequests = require('../../models/InstructorRequests');

router.get('/admin-dashboard', async (req, res) => {
    try {
        // Fetch all courses
        const courses = await Course.find({});

        // Fetch all users and instructor requests
        const users = await User.find({}).sort({ signupDate: -1 }).limit(3); // Latest 3 users based on signupDate

        const instructors = await InstructorRequests.find({}).sort({ signupDate: -1 }).limit(3); // Latest 3 instructors based on signupDate

        // Fetch latest 3 user signups and instructor requests (latest sorted)
        const latestUsers = await User.find({}).sort({ createdAt: -1 }).limit(3);
        const latestInstructors = await InstructorRequests.find({}).sort({ createdAt: -1 }).limit(3);

        // Combine the logs and sort by date (most recent first)
        const activityLogs = [
            ...latestUsers.map(user => ({
                date: user.createdAt,
                action: 'New User Registered',
                adminName: 'Admin John' // Replace with dynamic admin name if available
            })),
            ...latestInstructors.map(request => ({
                date: request.createdAt,
                action: 'Instructor Request Approved',
                adminName: 'Admin John' // Replace with dynamic admin name if available
            }))
        ];

        activityLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by latest signupDate

        const totalUsers = await User.countDocuments({});

        const pendingInstructorRequests = await InstructorRequests.countDocuments({});

        if (!courses || courses.length === 0) {
            return res.status(404).json({ error: 'No courses found' });
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
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort reviews by date (latest first)
            .slice(0, 5);

        // Response object
        const dashboardData = {
            totalUsers,
            totalCourses,
            totalEnrollments,
            completionRate,
            latestReviews,
            pendingInstructorRequests,
            activityLogs // Include the mixed activity logs
        };

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
