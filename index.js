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