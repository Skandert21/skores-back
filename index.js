require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

app.use(cors({
     origin: '*',
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const SECRET = process.env.SECRET_PHRASE || "MusicSkores2026.";

app.get('/api/request-key/:trackId', (req, res) => {

    try {

        const trackId = decodeURIComponent(req.params.trackId);

        const data = SECRET + trackId;

        const hash = crypto
            .createHash('sha256')
            .update(data)
            .digest();

        const key = hash.slice(0,16);

        res.json({
            k: key.toString('base64')
        });

    } catch(e) {

        res.status(500).json({error:"key generation failed"});

    }

});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log("Server running on", PORT);
});