const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');

const router = express.Router();

// RUTAS
router.get('/', todos);
router.get('/:id', uno);
router.get('/:mes/:ano', controlador.estadisticasMensuales)
// router.post('/asignarempleado', controlador.asignarEmpleado)
// router.put('/', eliminar);
  

//OPERACIONES CRUD
async function todos (req, res, next) {
    try {
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);      
    } catch (err) {
        next(err);    
    }
};

async function uno (req, res, next) {
    try {
        const items = await controlador.uno(req.params.id);
        respuesta.success(req, res, items, 200);       
    } catch (err) {
        next(err);    
    }
};

//  async function query (req, res, next) {
//      try {
//          const items = await controlador.query();
//          respuesta.success(req, res, items, 200);       
//      } catch (err) {
//          next(err);    
//      }
//  };

// async function agregar (req, res, next) {
//     try {
//         const items = await controlador.agregar(req.body);
//         mensaje = 'Orden creada exitosamente'
//          if(req.body.id == 0){
//              mensaje = 'item guardado con exito';
//          } else {
//              mensaje = 'item actualizado con exito';
//          }
//         respuesta.success(req, res, mensaje, 201);      
//     } catch (err) {
//         next(err);    
//     }
// };

// async function eliminar (req, res, next) {
//     try {
//         const items = await controlador.eliminar(req.body);
//         respuesta.success(req, res, 'Item eliminado correctamente', 200);       
//     } catch (err) {
//         next(err);
//     }
// };


module.exports = router;