const express = require('express')
const router = express.Router()
const otp = require('../otp/otp')


const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

router.post('/req-otp', async (req, res) => {

    const { email, firstName } = req.body

    try {

        const otpCode = generateOTP();

        await otp(email, firstName, otpCode)
        console.log("Email Sent!")

        res.status(200).send({
            otp: otpCode
        })


    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({
            status: "error while requesting new OTP"
        })
    }

})

module.exports = router
