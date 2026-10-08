const express = require('express');
const fs = require('fs');
const path = require('path');
const clientesRouter = require('./routes/clientes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Asegurar que exista la carpeta data y el archivo clientes.json
const dataDir = path.join(__dirname, 'data');
const jsonPath = path.join(dataDir, 'clientes.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(jsonPath)) {
  fs.writeFileSync(jsonPath, JSON.stringify([], null, 2), 'utf-8');
}

// Rutas API
app.use('/clientes', clientesRouter);

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
