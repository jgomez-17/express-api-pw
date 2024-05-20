const TABLA = 'ordenes';


module.exports = function(dbInyectada, io){
    
    let db = dbInyectada;

    if(!db) {
        db = require('../../db/mysql');
    }

    //funcion para crear la orden
    crearOrden = async (req, res) => {
        const dataOrden = req.body.data;
      
        try {
          // Insertar datos del cliente
          const cliente = await db.agregar('clientes', {
            nombre: dataOrden.nombre,
            celular: dataOrden.celular,
            correo: dataOrden.correo
          });
      
          // Inserta los datos del vehículo
          const vehiculo = await db.agregar('vehiculos', {
            placa: dataOrden.placa,
            marca: dataOrden.marca,
            tipo: dataOrden.tipo,
            color: dataOrden.color,
            llaves: dataOrden.llaves,
            observaciones: dataOrden.observaciones
          });
      
          // Inserta los datos del servicio
          const servicio = await db.agregar('servicios', {
            nombre_servicios: dataOrden.nombre_servicios,
            costo: dataOrden.costo
          });
      
          // Inserta los datos de la orden
          const orden = await db.agregar('ordenes', {
            cliente_id: cliente.insertId, // Utiliza el ID del cliente insertado
            vehiculo_id: vehiculo.insertId, // Utiliza el ID del vehículo insertado
            servicio_id: servicio.insertId,// Utiliza el ID del servicio insertado
            estado: 'en curso'
          });


          // Emitir evento de nueva orden
          io.emit('nuevaOrden', orden);

          console.log('Orden creada correctamente:', orden);
          res.status(200).send('Datos recibidos y guardados correctamente');
        } catch (error) {
          console.error('Error al procesar la orden:', error);
          res.status(500).send('Error al procesar la orden');
        }
      }

      actualizarEstadoOrden = async (req, res) => {
        const { orderId, newStatus, employee  } = req.body;
    
        try {
            // Actualizar el estado de la orden en la base de datos
            await db.actualizarEstadoOrden('ordenes', { estado: newStatus, empleado: employee }, { id: orderId });
    
            console.log('Estado de la orden actualizado correctamente');
            res.status(200).send('Estado de la orden actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar el estado de la orden:', error);
            res.status(500).send('Error al actualizar el estado de la orden');
        }
    };

    actualizarEstadoOrden2 = async (req, res) => {
      const { orderId, newStatus, metodoPago } = req.body;
  
      try {
          // Actualizar el estado de la orden y el método de pago en la base de datos
          await db.actualizarEstadoOrden('ordenes', { estado: newStatus, metodoDePago: metodoPago }, { id: orderId });

          console.log('Estado de la orden y método de pago actualizados correctamente');
          res.status(200).send('Estado de la orden y método de pago actualizados correctamente');
      } catch (error) {
          console.error('Error al actualizar el estado de la orden:', error);
          res.status(500).send('Error al actualizar el estado de la orden');
      }
  };



    function todos () {
        return db.todos(TABLA);
    }
    
    function uno (id) {
        return db.uno(TABLA, id);
    }

  //   async function query (req, res, next) {
  //     try {
  //         const items = await db.query();
  //         respuesta.success(req, res, items, 200);
  //     } catch (err) {
  //         next(err);
  //     }
  // }

    //en las ordenes no necesito borrarlas ni editarlas
    
    // function agregar (body) {
    //     return db.agregar(TABLA, body);
    // }
    
    // function eliminar (body) {
    //     return db.eliminar(TABLA, body);
    // }

    return {
        todos,
        uno,
        // agregar,
        // eliminar,
        crearOrden,
        actualizarEstadoOrden,
        actualizarEstadoOrden2,
    }

}