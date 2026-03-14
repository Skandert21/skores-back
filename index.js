require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

// 1. Configuración de CORS (Permisivo para descartar bloqueos)
app.use(cors({
    origin: '*', 
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 2. Única declaración de la frase secreta
const SECRET_PHRASE = (process.env.SECRET_PHRASE || "").trim();

if (!SECRET_PHRASE) {
    console.warn("⚠️ ADVERTENCIA: SECRET_PHRASE no está definida en el entorno.");
}

// 3. Función única para generar la key
function buildKeyFromServer(trackId) {
    // Normalizamos el trackId para que no haya ruidos de símbolos
    const normalizedTrack = decodeURIComponent(trackId);
    const data = SECRET_PHRASE + normalizedTrack;

    const hash = crypto
        .createHash('sha256')
        .update(data)
        .digest();

    // 16 bytes para el XOR
    return hash.slice(0, 16).toString('base64');
}

// 4. Ruta única (usando el comodín * para rutas largas)
app.get('/api/request-key/:trackId(*)', (req, res) => {
    try {
        const { trackId } = req.params;
        
        if (!SECRET_PHRASE) {
            return res.status(500).json({ error: "Configuración de servidor incompleta" });
        }

        const key = buildKeyFromServer(trackId);
        
        console.log(`✅ Key generada con éxito para: ${trackId}`);
        res.json({ k: key });

    } catch (err) {
        console.error("❌ Error generando key:", err);
        res.status(500).json({ error: "Key generation failed" });
    }
});

// 5. Un solo puerto y una sola escucha
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor operativo en puerto ${PORT}`);
});