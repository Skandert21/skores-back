require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors()); // ¡Adiós errores de CORS!
app.use(express.json());
const corsOptions = {
    origin: 'https://skandert21.github.io', // Tu dominio de GitHub Pages
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// Tu "Frase Secreta" ahora vive en una variable de entorno
const SECRET_PHRASE = process.env.SECRET_PHRASE || "MusicSkores2026.";

// Versión Node.js de tu buildKey
function generateKey(trackId) {
    const data = SECRET_PHRASE + decodeURIComponent(trackId);
    // En Node usamos el módulo 'crypto' nativo
    const hash = crypto.createHash('sha256').update(data).digest();
    return hash.slice(0, 16); // Retorna Buffer (que es como un Uint8Array)
}
// Ruta en Node.js
app.get('/api/request-key/:trackId', (req, res) => {
    const trackId = req.params.trackId;
    const secret = process.env.SECRET_PHRASE; // Oculto en Render
    
    // Generamos la llave en el servidor
    const hash = crypto.createHash('sha256')
                       .update(secret + trackId)
                       .digest();
    
    // Enviamos solo los 16 bytes finales al cliente
    res.json({ k: hash.slice(0, 16).toString('base64') });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));