const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');

const router = express.Router();

// RUTAS
router.get('/', todos);
router.get('/:id', uno);
router.get('/placas/:placa', controlador.obtenerOrdenesPorPlaca);

// OPERACIONES CRUD definidas abajo

async function obtenerOrdenesPorPlaca (req, res, next) {
    try {
        const placa = req.params.placa;
        console.log('Placa recibida en la ruta:', placa);
        const ordenes = await controlador.obtenerOrdenesPorPlaca(placa); // Llama a la función con la placa
        respuesta.success(req, res, ordenes, 200);
    } catch (err) {
        next(err);
    }
}

async function todos(req, res, next) {
    try {
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}

async function uno(req, res, next) {
    try {
        const items = await controlador.uno(req.params.id);
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;
