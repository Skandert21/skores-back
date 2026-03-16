require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

app.use(cors({
   origin: 'https://skandert21.github.io', // Tu dominio de producción
    methods: ['GET', 'POST'], // Solo los métodos que necesitas
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}));

app.use(express.json());

const SECRET = process.env.SECRET_PHRASE || "MusicSkores2026.";


app.get('/api/request-key/:trackId', (req, res) => {
    const referer = req.headers.referer;
    const origin = req.headers.origin;

    // Solo permitimos si el referer es tu GitHub Pages
    if (!referer || !referer.startsWith('https://skandert21.github.io')) {
        return res.status(403).json({ error: "Acceso denegado: Solo peticiones desde el sitio oficial." });
    }
try {

        const trackId = decodeURIComponent(req.params.trackId);

        const data = SECRET + trackId;

        const hash = crypto
            .createHash('sha256')
            .update(data)
            .digest();

        const key = hash.slice(0,16);
json({
            k: key.toString('base64')
        });

        res.
    } catch(e) {

        res.status(500).json({error:"key generation failed"});

    }
});
 
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log("Server running on", PORT);
});