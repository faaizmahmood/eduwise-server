const express = require('express')
const router = express.Router()
const Instructor = require('../../models/InstructorRequests');

router.post('/requests', async (req, res) => {

    const instructorData = req.body;

    try {
        // Check if an instructor with the same user ID already exists
        const existingInstructorById = await Instructor.findOne({ userId: instructorData.userId });

        if (existingInstructorById) {
            return res.status(400).json({ message: 'User already Submitted.' });
        }

        // Check if an instructor with the same email already exists
        const existingInstructorByEmail = await Instructor.findOne({ email: instructorData.email });

        if (existingInstructorByEmail) {
            return res.status(400).json({ message: 'Try Diffrent E-Mail.' });
        }

        // Create a new Instructor instance using the data from the request
        const instructor = new Instructor(instructorData);

        // Save the new instructor to the database
        await instructor.save();

        // Respond with success message
        res.status(201).json({ message: 'Instructor added successfully!', instructor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add instructor', error });
    }

})

module.exports = router