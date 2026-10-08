const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../data/clientes.json');

const obtenerClientes = () => {
  try {
    const data = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const guardarClientes = (clientes) => {
  fs.writeFileSync(jsonPath, JSON.stringify(clientes, null, 2), 'utf-8');
};

// GET /clientes
router.get('/', (req, res) => {
  const clientes = obtenerClientes();
  res.json(clientes);
});

// POST /clientes
router.post('/', (req, res) => {
  const { nombre, edad, ciudad } = req.body;

  if (!nombre || !edad || !ciudad) {
    return res.status(400).json({ 
      error: 'Todos los campos son obligatorios (nombre, edad, ciudad).' 
    });
  }

  const edadNumero = Number(edad);
  if (isNaN(edadNumero) || edadNumero <= 0) {
    return res.status(400).json({ 
      error: 'La edad debe ser un número positivo válido.' 
    });
  }

  const clientes = obtenerClientes();
  const nuevoCliente = {
    id: Date.now(),
    nombre: nombre.trim(),
    edad: edadNumero,
    ciudad: ciudad.trim(),
    fecha: new Date().toISOString()
  };

  clientes.push(nuevoCliente);
  guardarClientes(clientes);

  let mensaje = `Hola ${nuevoCliente.nombre} de ${nuevoCliente.ciudad}, tienes ${nuevoCliente.edad} años.`;
  if (nuevoCliente.edad < 18) {
    mensaje += ' Este producto es solo para mayores de edad.';
  } else {
    mensaje += ' ¡Gracias por interesarte en nuestros productos!';
  }

  res.status(201).json({
    mensaje,
    cliente: nuevoCliente
  });
});

module.exports = router;
