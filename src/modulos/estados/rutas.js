const express = require('express');

const respuesta = require('../../red/respuestas');
const controlador = require('./index');

const router = express.Router();

router.get('/', todos);
router.get('/enespera', controlador.enEspera);
router.get('/encurso', controlador.enCurso);
router.get('/porpagar', controlador.porPagar);
router.get('/terminado', controlador.terminado)
router.get('/terminadohoy', controlador.terminadoHoy)

//OPERACIONES CRUD


async function todos (req, res, next) {
  try {
      const items = await controlador.todos();
      respuesta.success(req, res, items, 200);      
  } catch (err) {
      next(err);    
  }
};

  module.exports = router;
