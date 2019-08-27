const express = require('express');
const router = express.Router();

const Url = require('../models/Url');

// @route           GET /:code
// @description     Redirect to long/original url
router.get('/:code', async (req, res) => {
    try {
        // Search in the database for one corresponding Ulr to the transmitted shortCode
        const url = await Url.findOne({ urlCode: req.params.code});

        // There is a record in the database corresponding to the shortUrl
        if (url) {
            // Redirecting to the longUrl
            return res.redirect(url.longUrl);

        } else {
            return res.status(404).json('No url found')
        }

    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});


module.exports = router;