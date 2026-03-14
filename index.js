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
const SECRET_PHRASE = (process.env.SECRET_PHRASE || "MusicSkores2026.").trim();

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
// El (*) es la magia que acepta todas las barras diagonales
// El asterisco sin paréntesis captura TODO, incluyendo las barras "/"
// El (.*) es una expresión regular que captura absolutamente todo después de la barra
// Usamos el asterisco directo. Captura TODO lo que venga después de la barra.
// En la versión nueva, (.*) se escribe como :path(.*) o simplemente se usa una Regex pura
app.get(/^\/api\/request-key\/(.*)/, (req, res) => {
    try {
        // Al usar una Expresión Regular directa, el contenido cae en req.params[0]
        const trackId = req.params[0];

        console.log("TrackId capturado:", trackId);

        if (!trackId) {
            return res.status(400).json({ error: "No se proporcionó trackId" });
        }

        const key = buildKeyFromServer(trackId);
        res.json({ k: key });

    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json({ error: "Error interno" });
    }
});
// 5. Un solo puerto y una sola escucha
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor operativo en puerto ${PORT}`);
});