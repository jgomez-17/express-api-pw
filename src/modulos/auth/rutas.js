const express = require('express');

const respuesta = require('../../red/respuestas');
const controlador = require('./index');

const router = express.Router();

// RUTAS
// En tu archivo de rutas de Express
router.post('/login', async (req, res, next) => {
    try {
        const token = await controlador.login(req.body.usuario, req.body.password);
        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
});

router.get('/login', login);


//OPERACIONES CRUD

async function login (req, res, next) {
    try {
        const token = await controlador.login(req.body.usuario, req.body.password);
        respuesta.success(req, res, token, 200);       
    } catch (err) {
        next(err);    
    }
};

module.exports = router;
