const TABLA = 'vehiculos';

module.exports = function(dbInyectada){
    
    let db = dbInyectada;

    if(!db) {
        db = require('../../db/postgree');
    }

    async function consultarPlaca2(req, res) {
      const placa = req.params.placa;
  
      try {
          // Consulto el vehículo por su placa
          const vehiculo = await db.query('vehiculos', { placa });
  
          // Verifico si existe
          if (!vehiculo) {
              return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
          }
  
          // Obtener el ID del vehículo
          const vehiculoId = vehiculo.id;
  
          // Consultar una orden relacionada con el vehículo
          const orden = await db.query('ordenes', { vehiculo_id: vehiculoId });
  
          // Verificar si la orden existe
          if (!orden) {
              return res.status(404).json({ mensaje: 'Orden no encontrada para el vehículo con placa ' + placa });
          }
  
          // Consultamos los datos relacionados utilizando los IDs obtenidos
          const cliente = await db.query('clientes', { id: orden.cliente_id });
          const servicio = await db.query('servicios', { id: orden.servicio_id });
  
          const respuesta = {
              orden: {
                  id: orden.id,
                  fecha_orden: orden.fecha_orden,
                  cliente: cliente,
                  vehiculo: vehiculo,
                  servicio: servicio
              }
          };
  
          // Enviar la orden como respuesta
          res.status(200).json(respuesta);
          console.log(respuesta);
      } catch (error) {
          console.error('Error al consultar la información de la orden:', error);
          res.status(500).json({ mensaje: 'Error al procesar la solicitud' });
      }
    }

    async function consultarPlaca(req, res) {
      const placa = req.params.placa;
    
      try {
        // Consulto el vehículo por su placa
        const vehiculoResult = await db.queryGeneral('SELECT * FROM vehiculos WHERE placa = $1', [placa]);
        const vehiculo = vehiculoResult[0];
    
        // Verifico si existe
        if (!vehiculo) {
          return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
        }
    
        // Obtener el ID del vehículo
        const vehiculoId = vehiculo.id;
    
        // Consultar una orden relacionada con el vehículo
        const ordenResult = await db.queryGeneral('SELECT * FROM ordenes WHERE vehiculo_id = $1', [vehiculoId]);
        const orden = ordenResult[0];
    
        // Verificar si la orden existe
        if (!orden) {
          return res.status(404).json({ mensaje: 'Orden no encontrada para el vehículo con placa ' + placa });
        }
    
        // Consultamos los datos relacionados utilizando los IDs obtenidos
        const clienteResult = await db.queryGeneral('SELECT * FROM clientes WHERE id = $1', [orden.cliente_id]);
        const cliente = clienteResult[0];
    
        const servicioResult = await db.queryGeneral('SELECT * FROM servicios WHERE id = $1', [orden.servicio_id]);
        const servicio = servicioResult[0];
    
        const respuesta = {
          orden: {
            id: orden.id,
            fecha_orden: orden.fecha_orden,
            cliente: cliente,
            vehiculo: vehiculo,
            servicio: servicio
          }
        };
    
        // Enviar la orden como respuesta
        res.status(200).json(respuesta);
        console.log(respuesta);
      } catch (error) {
        console.error('Error al consultar la información de la orden:', error);
        res.status(500).json({ mensaje: 'Error al procesar la solicitud' });
      }
    }

    function todos () {
        return db.todos(TABLA);
    }
    
    function uno (id) {
        return db.uno(TABLA, id);
    }
    
    // function agregar (body) {
    //     return db.agregar(TABLA, body);
    // }
    
    function eliminar (body) {
        return db.eliminar(TABLA, body);
    }

    return {
        todos,
        uno,
        // agregar,
        eliminar,
        consultarPlaca
    }

}