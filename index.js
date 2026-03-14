require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
/*
const corsOptions = {
    origin: 'https://skandert21.github.io',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
*/

 
app.use(cors({
    origin: '*', // Permite todo temporalmente para descartar fallos de Render
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const SECRET_PHRASE = process.env.SECRET_PHRASE ? process.env.SECRET_PHRASE.trim() : "";

app.get('/api/request-key/:trackId(*)', (req, res) => {
    try {
        // Usamos :trackId(*) para que acepte las barras '/' de tu URL
        const trackId = req.params.trackId;
        const data = SECRET_PHRASE + trackId;

        const hash = crypto.createHash('sha256').update(data).digest();
        const base64Key = hash.slice(0, 16).toString('base64');

        console.log(`Petición para: ${trackId}`);
        res.json({ k: base64Key });
    } catch (e) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
const SECRET_PHRASE = process.env.SECRET_PHRASE;

if (!SECRET_PHRASE) {
    throw new Error("SECRET_PHRASE no está definida en .env");
}

// Función única para generar la key
function buildKeyFromServer(trackId) {

    // importante: normalizar el trackId
    const normalizedTrack = decodeURIComponent(trackId);

    const data = SECRET_PHRASE.trim() + normalizedTrack;

    const hash = crypto
        .createHash('sha256')
        .update(data)
        .digest();

    // 16 bytes para tu XOR
    return hash.slice(0, 16).toString('base64');
}

app.get('/api/request-key/:trackId', (req, res) => {
    try {

        const { trackId } = req.params;

        const key = buildKeyFromServer(trackId);

        res.json({ k: key });

    } catch (err) {

        console.error("Error generando key:", err);

        res.status(500).json({ error: "Key generation failed" });

    }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`Servidor operativo en puerto ${PORT}`);
});