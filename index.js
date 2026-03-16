require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

const ALLOWED_ORIGIN = 'https://skandert21.github.io';

app.use(cors({
    origin: ALLOWED_ORIGIN,
    methods: ['GET'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}));

app.use(express.json());

const SECRET = process.env.SECRET_PHRASE || "MusicSkores2026.";

app.get('/api/request-key/:trackId', (req, res) => {
    const referer = req.headers.referer;
    // El header 'origin' suele venir en peticiones fetch/XHR
    const origin = req.headers.origin; 

    // VALIDACIÓN DE SEGURIDAD
    // Bloquea si no viene de tu dominio o si es una petición directa (sin referer)
    if (!referer || !referer.startsWith(ALLOWED_ORIGIN)) {
        console.warn(`Intento de acceso bloqueado. Referer: ${referer}`);
        return res.status(403).json({ error: "Forbidden: Acceso restringido al sitio oficial." });
    }

    try {
        const trackId = decodeURIComponent(req.params.trackId);
        const data = SECRET + trackId;

        const hash = crypto
            .createHash('sha256')
            .update(data)
            .digest();

        const key = hash.slice(0, 16);

        // Envío de respuesta correcto
        res.json({
            k: key.toString('base64')
        });

    } catch(e) {
        console.error("Error generating key:", e);
        res.status(500).json({ error: "key generation failed" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});