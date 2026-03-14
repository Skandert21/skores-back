require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

// Configuración de CORS única y limpia
const corsOptions = {
    origin: 'https://skandert21.github.io', 
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Sacamos la lógica a una función para no repetir errores
function buildKeyFromServer(trackId) {
    const secret = process.env.SECRET_PHRASE; 
    // USAMOS decodeURIComponent para que coincida con tu lógica de cifrado original
    const data = secret + decodeURIComponent(trackId);
    
    const hash = crypto.createHash('sha256')
                       .update(data)
                       .digest();
    
    return hash.slice(0, 16).toString('base64');
}

app.get('/api/request-key/:trackId', (req, res) => {
    const { trackId } = req.params;
    
    // .trim() aquí asegura que no haya saltos de línea ocultos de Render
    const secret = process.env.SECRET_PHRASE.trim(); 
    
    // IMPORTANTE: Usa exactamente la misma unión que usabas en el front.
    // Si en el front NO usabas decodeURIComponent, quítalo aquí también.
    const data = secret + trackId; 

    const hash = crypto.createHash('sha256').update(data).digest();
    res.json({ k: hash.slice(0, 16).toString('base64') });
});

const PORT = process.env.PORT || 10000; // Render prefiere puertos altos o dinámicos
app.listen(PORT, () => console.log(`Servidor operativo en puerto ${PORT}`));