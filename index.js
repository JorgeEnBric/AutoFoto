//Servidor node js
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');
const port = 3000;

// Configuración de multer para guardar archivos
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'Galeria');
        await fs.ensureDir(uploadDir); 
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'foto-' + uniqueSuffix + '.jpg');
    }
});

const upload = multer({ storage: storage });

// Middleware para servir archivos estáticos
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para guardar fotos
app.post('/guardar-foto', upload.single('foto'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se recibió ninguna foto' });
    }
    res.json({ 
        mensaje: 'Foto guardada exitosamente',
        ruta: `/Galeria/${path.basename(req.file.path)}`
    });
});

// Ruta para obtener la lista de fotos
getFotos = () => {
    const galeriaPath = path.join(__dirname, 'Galeria');
    if (!fs.existsSync(galeriaPath)) return [];
    return fs.readdirSync(galeriaPath)
        .filter(file => file.endsWith('.jpg'))
        .map(file => `/Galeria/${file}`);
};

app.get('/obtener-fotos', (req, res) => {
    res.json({ fotos: getFotos() });
});

// Ruta principal para servir el HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'componentes.html'));
});

// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
    
    // Crear el directorio de galería si no existe
    const galeriaPath = path.join(__dirname, 'Galeria');
    fs.ensureDirSync(galeriaPath);
    console.log(`Las fotos se guardarán en: ${galeriaPath}`);
});