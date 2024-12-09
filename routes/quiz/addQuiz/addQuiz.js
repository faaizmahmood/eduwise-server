const express = require('express');
const router = express.Router();
const Quiz = require('../../../models/quiz');
const Course = require('../../../models/courses')
const mongoose = require('mongoose');

// Route to add a new quiz
router.post('/addquiz', async (req, res) => {

    try {

        const { course_id, quiz_title, questions } = req.body;

        const COURSE_ID = new mongoose.Types.ObjectId(course_id);


        // Validate request payload
        if (!course_id || !quiz_title || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ error: 'Invalid data. course_id, quiz_title, and questions are required.' });
        }

        // Check if the course exists
        const course = await Course.findOne({ _id: COURSE_ID });
        if (!course) {
            return res.status(404).json({ error: 'Course not found.' });
        }


        // Check if a quiz for this course already exists
        const existingQuiz = await Quiz.findOne({ course_id: COURSE_ID });
        if (existingQuiz) {
            return res.status(401).json({
                error: 'A quiz for this course already exists. You cannot add another quiz.',
            });
        }

        await Course.findByIdAndUpdate(
            { _id: COURSE_ID },
            { status: 'complete' },
            { new: true }
        )


        // Create a new quiz instance
        const newQuiz = new Quiz({
            course_id,
            quiz_title,
            questions
        });

        // Save the quiz to the database
        await newQuiz.save();

        // Respond with the created quiz
        res.status(201).json({
            message: 'Quiz added successfully!',
            quiz: newQuiz
        });
    } catch (error) {
        console.error('Error adding quiz:', error);
        res.status(500).json({ error: 'An error occurred while adding the quiz.' });
    }
});

module.exports = router;
