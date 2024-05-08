const TABLA = 'ordenes';
const respuesta = require('../../red/respuestas');

module.exports = function(dbInyectada){
    
    let db = dbInyectada;

    if(!db) {
        db = require('../../db/mysql');
    }

    function todos () {
        return db.todos(TABLA);
    }

    async function enCurso(req, res, next) {
        const estado = 'en curso';
    
        try {
            // Consultar las órdenes en curso
            const ordenesEnCurso = await db.query('ordenes', { estado });
    
            // Verificar si hay órdenes en curso
            if (!ordenesEnCurso || ordenesEnCurso.length === 0) {
                return res.status(404).json({ mensaje: 'No se encontraron órdenes en curso' });
            }
    
            const respuesta = {
                ordenes: []
            };
    
            // Consultar los datos relacionados para cada orden en curso
            for (const orden of ordenesEnCurso) {
                // Consultar datos relacionados del cliente
                const cliente = await db.uno('clientes', orden.cliente_id);
    
                // Consultar datos relacionados del vehículo
                const vehiculo = await db.uno('vehiculos', orden.vehiculo_id);
    
                // Consultar datos relacionados del servicio
                const servicio = await db.uno('servicios', orden.servicio_id);
    
                respuesta.ordenes.push({
                    id: orden.id,
                    fechaOrden: orden.fecha_orden,
                    cliente: cliente[0],
                    vehiculo: vehiculo[0],
                    servicio: servicio[0]
                });
            }
    
            // Enviar la respuesta con las órdenes en curso y sus datos relacionados
            res.status(200).json(respuesta);
            console.log(respuesta)
        } catch (error) {
            console.error('Error al consultar la información de las órdenes en curso:', error);
            next(error);
        }
    }
    
    // function enCurso (req, res, next) {
    //     const tabla = 'ordenes'
    //     const consulta = { estado: 'en curso' };
    //     db.queryEstados(tabla, consulta)
    //         .then(items => {
    //             respuesta.success(req, res, items, 200);
    //         })
    //         .catch(err => {
    //             next(err);
    //         });
    // }

    function porPagar (req, res, next) {
        const tabla = 'ordenes'
        const consulta = { estado: 'por pagar' };
        db.queryEstados(tabla, consulta)
            .then(items => {
                respuesta.success(req, res, items, 200);
            })
            .catch(err => {
                next(err);
            });
    }

    function terminado (req, res, next) {
        const tabla = 'ordenes'
        const consulta = { estado: 'terminado' };
        db.queryEstados(tabla, consulta)
            .then(items => {
                respuesta.success(req, res, items, 200);
            })
            .catch(err => {
                next(err);
            });
    }
    

    //en las ordenes no necesito borrarlas ni editarlas
    
    // function agregar (body) {
    //     return db.agregar(TABLA, body);
    // }
    
    // function eliminar (body) {
    //     return db.eliminar(TABLA, body);
    // }

    return {
        todos,
        enCurso,
        porPagar,
        terminado,
        // agregar,
        // eliminar,

    }

}