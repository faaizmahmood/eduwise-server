const express = require('express');
const router = express.Router();
const Course = require('../../../models/courses');

router.put('/review-course/:courseID', async (req, res) => {
    const { courseID } = req.params;
    const { student_id, rating, comment } = req.body;

    // Validate input
    if (!student_id || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Invalid rating or missing required fields.' });
    }

    try {
        // Find the course
        const course = await Course.findById(courseID);

        if (!course) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        // Check if the student has already reviewed the course
        const existingReview = course.ratings.reviews.find(
            (review) => review.student_id.toString() === student_id
        );

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this course.' });
        }

        // Add the new review
        course.ratings.reviews.push({ student_id, rating, comment });

        // Update average rating and total reviews
        const totalReviews = course.ratings.reviews.length;
        const totalRatingSum = course.ratings.reviews.reduce((sum, review) => sum + review.rating, 0);
        course.ratings.average_rating = totalRatingSum / totalReviews;
        course.ratings.total_reviews = totalReviews;

        // Save the updated course
        await course.save();

        return res.status(200).json({ message: 'Review added successfully.', ratings: course.ratings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while adding the review.' });
    }
});

module.exports = router;
