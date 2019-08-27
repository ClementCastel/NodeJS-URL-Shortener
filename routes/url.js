const express = require('express');
const router = express.Router();

const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');


const Url = require('../models/Url');

// @route           POST /api/url/shorten
// @description     Create short URL

router.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    const baseUrl = config.get('baseUrl');

    // Check base url
    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base url');
    }

    // Create URL Code
    const urlCode = shortid.generate();

    // Check long url
    if (validUrl.isUri(longUrl)) {
        try {
            let url = await Url.findOne({ longUrl });

            // A record for this longUrl has been found
            if (url) {
                res.json(url);
            } else { // no record for this longUrl

                //Construct the new shortUrl
                const shortUrl = baseUrl + '/' + urlCode;

                url = new Url({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date: new Date()
                });

                // Save to the database
                await url.save();

                res.json(url);
            }
        } catch (e) {
            console.error(e);

            res.status(500).json('Server error');
        }
    } else { // not valid
        res.status(401).json('Invalid long url');
    }
});

module.exports = router;