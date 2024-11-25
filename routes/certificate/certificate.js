const express = require('express')
const router = express.Router()

const Certificate = require('../../models/certificate');

router.get('/all-certificate/:userID', async (req, res) => {

    const { userID } = req.params;


    try {

        const certificate_response = await Certificate.find({ 'student.student_id': userID });

        if (!certificate_response) {
            return res.status(404).json({ error: 'Now Certificate found.' });
        }

        return res.status(200).json({ message: 'Certificate Get Successfully.', certificates: certificate_response });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while adding the review.' });
    }

})


module.exports = router;
