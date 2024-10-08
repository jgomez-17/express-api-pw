const TABLA = 'ordenes';
const { format, zonedTimeToUtc } = require('date-fns-tz');

module.exports = function(dbInyectada, io){
    
    let db = dbInyectada;

    if(!db) {
        db = require('../../db/postgree');
    }

    crearOrden = async (req, res) => {
      const dataOrden = req.body.data;
      console.log(req.body.data);
  
      try {

          const fechaCol = format(new Date(), 'yyyy-MM-dd HH:mm:ss', { timeZone: 'America/Bogota' });

          // Inserta los datos del vehículo
          const vehiculo = await db.agregar('vehiculos', {
              placa: dataOrden.placa,
              marca: dataOrden.marca,
              tipo: dataOrden.tipo,
              color: dataOrden.color,
              llaves: dataOrden.llaves,
              observaciones: dataOrden.observaciones
          });
  
          if (!vehiculo || !vehiculo.id) {
              throw new Error('No se pudo obtener el ID del vehículo insertado');
          }
  
          // Insertar datos del cliente
          const cliente = await db.agregar('clientes', {
              nombre: dataOrden.nombre,
              celular: dataOrden.celular,
              correo: dataOrden.correo
          });
  
          if (!cliente || !cliente.id) {
              throw new Error('No se pudo obtener el ID del cliente insertado');
          }
  
          // Inserta los datos del servicio
          const servicio = await db.agregar('servicios', {
              nombre_servicios: dataOrden.nombre_servicios,
              costo: dataOrden.costo,
              descuento: dataOrden.descuento
          });
  
          if (!servicio || !servicio.id) {
              throw new Error('No se pudo obtener el ID del servicio insertado');
          }

          // Obtener la fecha y hora actual en formato ISO (UTC)
  
          // Inserta los datos de la orden
          const orden = await db.agregar('ordenes', {
              cliente_id: cliente.id,
              vehiculo_id: vehiculo.id,
              servicio_id: servicio.id,
              estado: 'en espera',
              fecha_orden: fechaCol // Asignar la fecha de la orden
          });

  
          console.log('Orden creada correctamente:', orden);
          res.status(200).send('Datos recibidos y guardados correctamente');
      } catch (error) {
          console.error('Error al procesar la orden:', error);
          res.status(500).send('Error al procesar la orden');
      }
    }  

    //actualiza a en curso e inserta empleados
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
    
    //Actualiza a terminado e inserta metodo de pago
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

    //actualiza a por pagar
    actualizarEstadoOrden3 = async (req, res) => {
      const { orderId, newStatus } = req.body;
  
      try {
          // Actualizar el estado de la orden y el método de pago en la base de datos
          await db.actualizarEstadoOrden('ordenes', { estado: newStatus }, { id: orderId });
  
          console.log('Estado de la orden actualizado');
          res.status(200).send('Estado de la orden actualizado');
      } catch (error) {
          console.error('Error al actualizar el estado de la orden:', error);
          res.status(500).send('Error al actualizar el estado de la orden');
      }
   };


    //Cancela la orden
    cancelarOrden = async (req, res) => {
      const { orderId, newStatus } = req.body;

      try {
          // Actualizar el estado de la orden y el método de pago en la base de datos
          await db.actualizarEstadoOrden('ordenes', { estado: newStatus }, { id: orderId });

          console.log('Orden cancelada correctamente');
          res.status(200).send('Orden cancelada correctamente');
      } catch (error) {
          console.error('Error al cancelar la orden:', error);
          res.status(500).send('Error al cancelar la orden');
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
        actualizarEstadoOrden3,
        cancelarOrden
    }

}