const TABLA = 'ordenes';

module.exports = function(dbInyectada, io){
    
    let db = dbInyectada;
    
    if(!db) {
        db = require('../../db/postgree');
    }
    
    function todos () {
        return db.todos(TABLA);
    }
    
    function uno (id) {
        return db.uno(TABLA, id);
    }

    async function query (req, res, next) {
      try {
          const items = await db.query();
          respuesta.success(req, res, items, 200);
      } catch (err) {
          next(err);
      }
    }
    
    function agregar (body) {
        return db.agregar(TABLA, body);
    }

    function eliminar (body) {
        return db.eliminar(TABLA, body);
    }

    //     const query = `
    //         SELECT
    //             o.id,
    //             o.fecha_orden,
    //             o.estado,
    //             o.empleado,
    //             o.metododepago,
    //             c.id AS cliente_id,
    //             c.nombre AS cliente_nombre,
    //             c.celular AS cliente_celular,
    //             c.correo AS cliente_correo,
    //             v.id AS vehiculo_id,
    //             v.placa AS vehiculo_placa,
    //             v.marca AS vehiculo_marca,
    //             v.tipo AS vehiculo_tipo,
    //             v.color AS vehiculo_color,
    //             v.llaves AS vehiculo_llaves,
    //             v.observaciones AS vehiculo_observaciones,
    //             s.id AS servicio_id,
    //             s.nombre_servicios AS servicio_nombre,
    //             s.descuento AS servicio_descuento,
    //             s.costo AS servicio_costo
    //         FROM
    //             ordenes o
    //         INNER JOIN
    //             vehiculos v ON o.vehiculo_id = v.id
    //         INNER JOIN
    //             clientes c ON o.cliente_id = c.id
    //         INNER JOIN
    //             servicios s ON o.servicio_id = s.id
    //         WHERE
    //             v.placa = $1
    //     `;
    
    //     try {
    //         const result = await pool.query(query, [placa]);
    //         return result.rows.map(row => ({
    //             id: row.id,
    //             fechaOrden: row.fecha_orden,
    //             estado: row.estado,
    //             empleado: row.empleado,
    //             metododepago: row.metododepago,
    //             cliente: {
    //                 id: row.cliente_id,
    //                 nombre: row.cliente_nombre,
    //                 celular: row.cliente_celular,
    //                 correo: row.cliente_correo,
    //             },
    //             vehiculo: {
    //                 id: row.vehiculo_id,
    //                 placa: row.vehiculo_placa,
    //                 marca: row.vehiculo_marca,
    //                 tipo: row.vehiculo_tipo,
    //                 color: row.vehiculo_color,
    //                 llaves: row.vehiculo_llaves,
    //                 observaciones: row.vehiculo_observaciones,
    //             },
    //             servicio: {
    //                 id: row.servicio_id,
    //                 nombre_servicios: row.servicio_nombre,
    //                 descuento: row.servicio_descuento,
    //                 costo: row.servicio_costo,
    //             }
    //         }));
    //     } catch (error) {
    //         console.error('Error al obtener las órdenes por placa:', error);
    //         throw error;
    //     }
    // };
    
    async function obtenerOrdenesPorPlaca(req, res) {
        const placa = req.params.placa;
    
        try {
            // Consulto las órdenes relacionadas con la placa
            const ordenesResult = await db.queryGeneral(`
                SELECT
                    o.id,
                    o.fecha_orden,
                    o.estado,
                    o.empleado,
                    o.metododepago,
                    c.id AS cliente_id,
                    c.nombre AS cliente_nombre,
                    c.celular AS cliente_celular,
                    c.correo AS cliente_correo,
                    v.id AS vehiculo_id,
                    v.placa AS vehiculo_placa,
                    v.marca AS vehiculo_marca,
                    v.tipo AS vehiculo_tipo,
                    v.color AS vehiculo_color,
                    v.llaves AS vehiculo_llaves,
                    v.observaciones AS vehiculo_observaciones,
                    s.id AS servicio_id,
                    s.nombre_servicios AS servicio_nombre,
                    s.descuento AS servicio_descuento,
                    s.costo AS servicio_costo
                FROM
                    ordenes o
                INNER JOIN
                    vehiculos v ON o.vehiculo_id = v.id
                INNER JOIN
                    clientes c ON o.cliente_id = c.id
                INNER JOIN
                    servicios s ON o.servicio_id = s.id
                WHERE
                    v.placa = $1
            `, [placa]);
    
            // Verificar si hay órdenes encontradas
            if (ordenesResult.length === 0) {
                return res.status(404).json({ mensaje: 'No se encontraron órdenes para el vehículo con placa ' + placa });
            }
    
            // Mapear las órdenes encontradas
            const ordenes = ordenesResult.map(orden => ({
                id: orden.id,
                fecha_orden: orden.fecha_orden,
                estado: orden.estado,
                empleado: orden.empleado,
                metododepago: orden.metododepago,
                cliente: {
                    id: orden.cliente_id,
                    nombre: orden.cliente_nombre,
                    celular: orden.cliente_celular,
                    correo: orden.cliente_correo,
                },
                vehiculo: {
                    id: orden.vehiculo_id,
                    placa: orden.vehiculo_placa,
                    marca: orden.vehiculo_marca,
                    tipo: orden.vehiculo_tipo,
                    color: orden.vehiculo_color,
                    llaves: orden.vehiculo_llaves,
                    observaciones: orden.vehiculo_observaciones,
                },
                servicio: {
                    id: orden.servicio_id,
                    nombre: orden.servicio_nombre,
                    descuento: orden.servicio_descuento,
                    costo: orden.servicio_costo,
                }
            }));
    
            // Enviar las órdenes como respuesta
            res.status(200).json(ordenes);
        } catch (error) {
            console.error('Error al consultar la información de la orden:', error);
            res.status(500).json({ mensaje: 'Error al procesar la solicitud' });
        }
    }
    

    
    return {
        todos,
        uno,
        agregar,
        eliminar,
        query,
        obtenerOrdenesPorPlaca
    }
}