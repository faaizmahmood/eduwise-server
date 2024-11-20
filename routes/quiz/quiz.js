const express = require('express');
const router = express.Router();
const Quiz = require('../../models/quiz'); // Adjust the path to your model as needed

router.get('/getquiz/:courseID', async (req, res) => {
    try {
        // Extract courseID from the request parameters
        const courseID = req.params.courseID;

        // Fetch the quiz associated with the given courseID
        const quiz = await Quiz.findOne({ course_id: courseID });

        // Check if the quiz exists
        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found for the given course ID."
            });
        }

        // Return the quiz data
        res.status(200).json({
            quizdata: quiz
        });
    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

module.exports = router;
