const express = require('express');
const router = express.Router();
const Course = require('../../../models/courses');

router.put('/review-course/:courseID', async (req, res) => {

    const { courseID } = req.params;
    const { student_id, rating, comment } = req.body;


    if (!student_id || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Invalid rating or missing required fields.' });
    }

    try {
        const course = await Course.findById(courseID);

        if (!course) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        course.ratings.reviews.push({ student_id, rating, comment });

        const totalReviews = course.ratings.reviews.length;
        const totalRatingSum = course.ratings.reviews.reduce((sum, review) => sum + review.rating, 0);
        course.ratings.average_rating = totalRatingSum / totalReviews;
        course.ratings.total_reviews = totalReviews;

        await course.save();

        return res.status(200).json({ message: 'Review added successfully.', ratings: course.ratings });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while adding the review.' });
    }



})


module.exports = router