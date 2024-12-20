const express = require('express');
const router = express.Router();
const Course = require('../../../models/courses');
const User = require('../../../models/auth');
const Certificate = require('../../../models/certificate');

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

        // Ensure the `reviews` array exists
        if (!course.ratings || !Array.isArray(course.ratings.reviews)) {
            course.ratings = course.ratings || {}; // Initialize `ratings` if missing
            course.ratings.reviews = []; // Initialize `reviews` array
        }

        // Check if the student has already reviewed the course
        const existingReview = course?.ratings?.reviews?.find(
            (review) => review?.student_id.toString() === student_id
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


        // Update user's completedCourses and currentCourses
        const user = await User.findById(student_id);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Add courseID to completedCourses if not already present
        if (!user.completed_courses.some(course => course.course_id.toString() === courseID.toString())) {
            user.completed_courses.push({
                course_id: courseID,
                title: course.title,
                completion_date: new Date().toISOString()
            });
        }

        // Remove courseID from currentCourses if present
        user.current_courses = user.current_courses.filter((course) => course.course_id.toString() !== courseID.toString());

        // Save the updated user
        await user.save();


        const newCertificate = new Certificate({
            title: course.title,
            description: course.description,
            issueDate: new Date().toISOString(),

            student: {
                student_id: user._id,
                student_name: `${user.fName} ${user.lName}`,
                student_email: user.email,
            },

            course: {
                course_id: course._id,
                course_title: course.title,
                course_description: course.description,
                language: course.language,
                level: course.level,
                duration: course.duration,

                tags: course.tags,

                instructor: {
                    instructor_id: course.instructor.id,
                    instructor_name: course.instructor.name,
                    instructor_pp: course.instructor.profile_image,
                    instructor_bio: course.instructor.bio,
                }
            }
        })

        await newCertificate.save();

        // Return the response with updated data
        const userDetails = await User.findById(student_id);
        return res.status(200).json({ message: 'Review added successfully.', ratings: course.ratings, userDetails: userDetails });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while adding the review.' });
    }
});

module.exports = router;
