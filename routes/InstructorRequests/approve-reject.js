// routes/instructors.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const User = require('../../models/auth');
require('dotenv').config();

// Models
const InstructorRequests = require('../../models/InstructorRequests'); // Requests collection
const Instructors = require('../../models/Instructors'); // Approved instructors collection

// POST endpoint to approve or reject an application
router.post('/admin-handle-request', async (req, res) => {
    
    const { requestID, userId, action } = req.body; // Expecting { requestID: '...', userId: '...', action: 'approve'/'reject' }

    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

    if (!isValidObjectId(requestID) || !isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid requestID or userId' });
    }

    const objectId = new mongoose.Types.ObjectId(requestID);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    try {
        // Find the user associated with the application
        const user = await User.findById(userObjectId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the request document
        const application = await InstructorRequests.findById(objectId);
        if (!application) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Email transporter setup
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD,
            },
        });

        // If the action is "approve"
        if (action === 'approve') {
            // Remove the __v field to avoid versioning issues
            const { __v, ...instructorData } = application.toObject();

            // Create a new instructor with the approved data
            const newInstructor = new Instructors(instructorData);
            await newInstructor.save(); // Save the new instructor

            // Remove the application from requests
            await InstructorRequests.findByIdAndDelete(objectId);

            // Send approval email
            const htmlContent = `
                <h1>Congratulations!</h1>
                <p>Your application to become an instructor has been approved.</p>
                <p>We are excited to have you on board!</p>
            `;

            const info = await transporter.sendMail({
                from: {
                    name: 'EduWise',
                    address: process.env.USER
                },
                to: user.email,
                subject: "Become Instructor Application Approved",
                html: htmlContent,
            });

            return res.status(200).json({ message: 'Application approved' });

        } else if (action === 'reject') {
            // Simply delete the request
            await InstructorRequests.findByIdAndDelete(objectId);

            // Send rejection email
            const htmlContent = `
                <h1>Application Rejected</h1>
                <p>We regret to inform you that your application to become an instructor has been rejected.</p>
                <p>We appreciate your interest and encourage you to apply again in the future.</p>
            `;

            const info = await transporter.sendMail({
                from: {
                    name: 'EduWise',
                    address: process.env.USER
                },
                to: user.email,
                subject: "Become Instructor Application Rejected",
                html: htmlContent,
            });

            return res.status(200).json({ message: 'Application rejected!' });

        } else {
            return res.status(400).json({ message: 'Invalid action. Must be approve or reject.' });
        }
    } catch (error) {
        console.error('Error handling application request:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
});

module.exports = router;
