const express = require('express');
const router = express.Router();
const Instructor = require('../../models/Instructors'); // Adjust model path if needed
const Courses = require('../../models/courses'); 
const mongoose = require('mongoose');

router.get("/instructor-profile/:instructorID", async (req, res) => {
    try {
        const { instructorID } = req.params;

        const objectId = new mongoose.Types.ObjectId(instructorID);

        // Find the instructor by ID
        const instructor = await Instructor.findById(objectId);

        if (!instructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }

        // Find courses by the instructor ID
        const courses = await Courses.find({ 'instructor.id': objectId });

        // Return the instructor and their courses
        res.status(200).json({
            instructor,
            courses,
        });

    } catch (error) {
        console.error("Error fetching instructor and courses:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;