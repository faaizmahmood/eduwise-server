const express = require('express');
const router = express.Router();

const Certificate = require('../../models/certificate');

router.get('/single-certificate/:certificateID', async (req, res) => {
    const { certificateID } = req.params;

    try {
        // Pass certificateID directly instead of wrapping it in an object
        const certificate_response = await Certificate.findById(certificateID);

        if (!certificate_response) {
            return res.status(404).json({ error: 'No Certificate found.' });
        }

        return res.status(200).json({ message: 'Certificate retrieved successfully.', certificates: certificate_response });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while retrieving the certificate.' });
    }
});

module.exports = router;
