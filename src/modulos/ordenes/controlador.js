const TABLA = 'ordenes';
const {EventEmitter} = require('events');
const eventEmitter = new EventEmitter();

module.exports = function(dbInyectada){
    
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


          console.log('Orden creada correctamente:', orden);
          res.status(200).send('Datos recibidos y guardados correctamente');
        } catch (error) {
          console.error('Error al procesar la orden:', error);
          res.status(500).send('Error al procesar la orden');
        }
      }

      actualizarEstadoOrden = async (req, res) => {
        const { orderId, newStatus } = req.body;
    
        try {
            // Actualizar el estado de la orden en la base de datos
            await db.actualizarEstadoOrden('ordenes', { estado: newStatus }, { id: orderId });
    
            console.log('Estado de la orden actualizado correctamente');
            res.status(200).send('Estado de la orden actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar el estado de la orden:', error);
            res.status(500).send('Error al actualizar el estado de la orden');
        }
    };

    asignarEmpleado = async (req, res) => {
      const { orderId, nombreEmpleado } = req.body;
  
      try {
          // Actualizar el estado de la orden en la base de datos
          await db.actualizarEstadoOrden('ordenes', { empleado: nombreEmpleado }, { id: orderId });
  
          console.log('Empleado asignado correctamente');
          res.status(200).send('Empleado asignado correctamente');
      } catch (error) {
          console.error('Error al asignar empleado:', error);
          res.status(500).send('Error al asignar empleado');
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
        asignarEmpleado
    }

}