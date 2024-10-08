const express = require('express');
const cors = require('cors');
const app = express();

// Middleware para manejar JSON
app.use(express.json());
app.use(cors());


const port = 5000;

// Ruta para obtener productos simulados
app.get('/productos', (req, res) => {
    const productos = [
        { id: 1, nombre: 'Producto 1', precio: 100, fecha_termino: '2024-10-10', imagen: 'https://via.placeholder.com/150' },
        { id: 2, nombre: 'Producto 2', precio: 200, fecha_termino: '2024-11-12', imagen: 'https://via.placeholder.com/150' }
    ];
    res.json(productos);
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});