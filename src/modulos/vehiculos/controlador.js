const TABLA = 'vehiculos';

module.exports = function(dbInyectada){
    
    let db = dbInyectada;

    if(!db) {
        db = require('../../db/mysql');
    }

    async function consultarPlaca (req, res) {
      const placa = req.params.placa;
    
      try {
        // Consulto el vehículo por su placa
        const vehiculo = await db.query('vehiculos', { placa });
    
        // Verifico si existe
        if (!vehiculo || vehiculo.length === 0) {
          return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
        }
    
        // Obtener el ID del vehículo
        const vehiculoId = vehiculo[0].id;
    
        // Consultar la orden relacionada con el vehículo
        const ordenes = await db.query('ordenes', { vehiculo_id: vehiculoId });
    
        // Verificar si la orden existe
        if (!ordenes || ordenes.length === 0) { //nuevo
          return res.status(404).json({ mensaje: 'Orden no encontrada para el vehículo con placa ' + placa });
        }

        const respuesta = {
          ordenes: []
        }

         // Ahora, consultamos los datos relacionados utilizando los IDs obtenidos
        for (const orden of ordenes) {
          const cliente = await db.uno('clientes', orden.cliente_id);
          const servicio = await db.uno('servicios', orden.servicio_id);

          respuesta.ordenes.push({
            id: orden.id,
            fecha_orden: orden.fecha_orden,
            cliente: cliente[0],
            vehiculo: vehiculo[0],
            servicio: servicio[0]
        });
        }        
    
        // Enviar la orden como respuesta
        res.status(200).json(respuesta);
        console.log(respuesta)
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