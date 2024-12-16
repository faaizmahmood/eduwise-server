const express = require('express');
const router = express.Router();
const Instructor = require('../../models/Instructors');
const SuspendedAccount = require('../../models/suspended');
const User = require('../../models/auth');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Delete user and suspend their account
router.post('/delete-user/:ID', async (req, res) => {


    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
        },
    });

    try {
        const { ID } = req.params;

        // Validate the provided ObjectId
        if (!mongoose.Types.ObjectId.isValid(ID)) {
            return res.status(400).json({ message: 'Invalid requestID or userId' });
        }

        const objectID = new mongoose.Types.ObjectId(ID);

        // Extract data from the request body
        const { full_name, account_type, suspension_reason, email, admin_in_charge } = req.body;

        // Check if the account is already suspended
        const isAccountSuspended = await SuspendedAccount.findOne({ email: email });

        if (isAccountSuspended) {
            return res.status(409).json({
                status: "This Account is Already Suspended!",
            });
        }

        // Create a new suspended account document
        const newSuspendedAccount = new SuspendedAccount({
            full_name,
            account_type,
            suspension_reason,
            email,
            admin_in_charge,
        });

        // Save the suspended account document
        await newSuspendedAccount.save();

        // Find instructor by ID to get associated userId
        const instructor = await Instructor.findById(objectID);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        const userID = new mongoose.Types.ObjectId(instructor.userId);

        // Find user associated with the instructor
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the instructor account
        await Instructor.findByIdAndDelete(objectID);

        // Prepare the email content for account suspension notification
        const htmlContent = `
            <h1>Account Suspension Notification</h1>
            <p>Dear ${full_name},</p>
            <p>We regret to inform you that your account has been suspended due to the following reason:</p>
            <p><strong>Reason for Suspension:</strong> ${suspension_reason}</p>
            <p>If you believe this suspension was made in error or would like to appeal, please contact our support team at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>.</p>
            <p>We appreciate your understanding and cooperation in this matter.</p>
            <p>Best regards,</p>
            <p>The EduWise Team</p>
        `;

        // Send the email to the user
        await transporter.sendMail({
            from: {
                name: 'EduWise',
                address: process.env.USER
            },
            to: user.email,
            subject: "Your Account Has Been Suspended",
            html: htmlContent,
        });

        // Send success response
        return res.status(200).json({
            message: 'Instructor account suspended and deleted successfully',
        });

    } catch (error) {
        console.error('Error handling application request:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }


});

module.exports = router;
