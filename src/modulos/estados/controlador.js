const { format } = require('date-fns');
const TABLA = 'ordenes';
const respuesta = require('../../red/respuestas');
const moment = require('moment-timezone');


module.exports = function(dbInyectada){
    
    let db = dbInyectada;

    if(!db) {
        db = require('../../db/postgree');
    }

    function todos () {
        return db.todos(TABLA);
    }


    //estado EN ESPERA
    async function enEspera(req, res, next) {
        const estado = 'en espera';
    
        try {
            // Consultar las órdenes en curso
            const ordenesEnEspera = await db.queryEstados('ordenes', { estado });
    
            // Verificar si hay órdenes en curso
            if (!ordenesEnEspera || ordenesEnEspera.length === 0) {
                return res.status(404).json({ mensaje: 'No se encontraron órdenes en espera' });
            }
    
            const respuesta = {
                ordenes: [],
                numeroOrdenesEnEspera: 0
            };
    
            // Consultar los datos relacionados para cada orden en curso
            for (const orden of ordenesEnEspera) {
                // Consultar datos relacionados del cliente
                const cliente = await db.uno('clientes', orden.cliente_id);
    
                // Consultar datos relacionados del vehículo
                const vehiculo = await db.uno('vehiculos', orden.vehiculo_id);
    
                // Consultar datos relacionados del servicio
                const servicio = await db.uno('servicios', orden.servicio_id);
    
                respuesta.ordenes.push({
                    id: orden.id,
                    fechaOrden: orden.fecha_orden,
                    estado: orden.estado,
                    cliente: cliente[0],
                    vehiculo: vehiculo[0],
                    servicio: servicio[0]
                });
                respuesta.numeroOrdenesEnEspera += 1;
            }
    
            // Enviar la respuesta con las órdenes en curso y sus datos relacionados
            res.status(200).json(respuesta);
        } catch (error) {
            console.error('Error al consultar la información de las órdenes en espera:', error);
            next(error);
        }
    }

    //estado EN CURSO
    async function enCurso (req, res, next) {
        const estado = 'en curso';
    
        try {
            // Consultar las órdenes en curso
            const ordenesEnCurso = await db.queryEstados('ordenes', { estado });
    
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
                    estado: orden.estado,
                    empleado: orden.empleado,
                    cliente: cliente[0],
                    vehiculo: vehiculo[0],
                    servicio: servicio[0]
                });
            }
    
            // Enviar la respuesta con las órdenes en curso y sus datos relacionados
            res.status(200).json(respuesta);
        } catch (error) {
            console.error('Error al consultar la información de las órdenes en curso:', error);
            next(error);
        }
    }

    //estado POR PAGAR
    async function porPagar (req, res, next) {
        const estado = 'por pagar';
    
        try {
            // Consultar las órdenes en curso
            const ordenesPorPagar = await db.queryEstados('ordenes', { estado });
    
            // Verificar si hay órdenes en curso
            if (!ordenesPorPagar || ordenesPorPagar.length === 0) {
                return res.status(404).json({ mensaje: 'No se encontraron órdenes por pagar' });
            }
    
            const respuesta = {
                ordenes: [],
                numeroOrdenesPorPagar: 0
            };
    
            // Consultar los datos relacionados para cada orden en curso
            for (const orden of ordenesPorPagar) {
                // Consultar datos relacionados del cliente
                const cliente = await db.uno('clientes', orden.cliente_id);
    
                // Consultar datos relacionados del vehículo
                const vehiculo = await db.uno('vehiculos', orden.vehiculo_id);
    
                // Consultar datos relacionados del servicio
                const servicio = await db.uno('servicios', orden.servicio_id);
    
                respuesta.ordenes.push({
                    id: orden.id,
                    fechaOrden: orden.fecha_orden,
                    estado: orden.estado,
                    empleado: orden.empleado,
                    cliente: cliente[0],
                    vehiculo: vehiculo[0],
                    servicio: servicio[0]
                });
                respuesta.numeroOrdenesPorPagar += 1;
            }
    
            // Enviar la respuesta con las órdenes en por pagar y sus datos relacionados
            res.status(200).json(respuesta);
        } catch (error) {
            console.error('Error al consultar la información de las órdenes por pagar:', error);
            next(error);
        }
    }

    //estado TERMINADO
    async function terminado (req, res, next) {
        const estado = 'terminado';
    
        try {
            // Consultar las órdenes en curso
            const ordenesTerminadas = await db.queryEstados('ordenes', { estado });
    
            // Verificar si hay órdenes en curso
            if (!ordenesTerminadas || ordenesTerminadas.length === 0) {
                return res.status(404).json({ mensaje: 'No se encontraron órdenes terminadas' });
            }
    
            const respuesta = {
                ordenes: []
            };
    
            // Consultar los datos relacionados para cada orden en curso
            for (const orden of ordenesTerminadas) {
                // Consultar datos relacionados del cliente
                const cliente = await db.uno('clientes', orden.cliente_id);
    
                // Consultar datos relacionados del vehículo
                const vehiculo = await db.uno('vehiculos', orden.vehiculo_id);
    
                // Consultar datos relacionados del servicio
                const servicio = await db.uno('servicios', orden.servicio_id);
    
                respuesta.ordenes.push({
                    id: orden.id,
                    fechaOrden: orden.fecha_orden,
                    empleado: orden.empleado,
                    metodoDePago: orden.metodoDePago,
                    estado: orden.estado,
                    cliente: cliente[0],
                    vehiculo: vehiculo[0],
                    servicio: servicio[0]
                });
            }
    
            // Enviar la respuesta con las órdenes en curso y sus datos relacionados
            res.status(200).json(respuesta);
        } catch (error) {
            console.error('Error al consultar la información de las órdenes terminadas:', error);
            next(error);
        }
    }

    async function terminadoHoy(req, res, next) {
        const estado = 'terminado';
    
        try {
            // Consultar todas las órdenes terminadas
            const ordenesTerminadas = await db.queryEstados('ordenes', { estado });
    
            // Verificar si hay órdenes terminadas
            if (!ordenesTerminadas || ordenesTerminadas.length === 0) {
                return res.status(404).json({ mensaje: 'No se encontraron órdenes terminadas' });
            }
    
            // Obtener la fecha actual en formato YYYY-MM-DD
            const today = format(new Date(), 'yyyy-MM-dd');
    
            const respuesta = {
                ordenes: [],
                totalRecaudado: 0,
                numeroOrdenesHoy: 0,
                totalEfectivo: 0, // Inicializar el total pagado en efectivo
                totalNequi: 0,
                totalBancolombia: 0
            };
    
            // Consultar los datos relacionados para cada orden terminada y filtrar por fecha actual
            for (const orden of ordenesTerminadas) {
                const fechaOrden = format(new Date(orden.fecha_orden), 'yyyy-MM-dd');
                if (fechaOrden === today) {
                    
                    const cliente = await db.uno('clientes', orden.cliente_id);
                    const vehiculo = await db.uno('vehiculos', orden.vehiculo_id);
                    const servicio = await db.uno('servicios', orden.servicio_id);
        
                    respuesta.ordenes.push({
                        id: orden.id,
                        fechaOrden: orden.fecha_orden,
                        estado: orden.estado,
                        empleado: orden.empleado,
                        metododepago: orden.metododepago, // Asegúrate de que este nombre coincide con el nombre de la columna en tu tabla
                        cliente: cliente[0],
                        vehiculo: vehiculo[0],
                        servicio: servicio[0]
                    });
    
                    // Sumar el costo del servicio al total recaudado
                    const costoServicio = parseFloat(servicio[0].costo);
                    respuesta.totalRecaudado += costoServicio;
                    respuesta.numeroOrdenesHoy += 1;
    
                    // Sumar al total pagado según el método de pago
                    if (orden.metododepago === 'Efectivo') {
                        respuesta.totalEfectivo += costoServicio;
                    } else if (orden.metododepago === 'Nequi') {
                        respuesta.totalNequi += costoServicio;
                    } else if (orden.metododepago === 'Bancolombia') {
                        respuesta.totalBancolombia += costoServicio;
                    }
                }
            }
    
            // Verificar si hay órdenes terminadas para el día actual
            if (respuesta.ordenes.length === 0) {
                return res.status(404).json({ mensaje: 'No se encontraron órdenes terminadas para el día actual' });
            }
    
            // Enviar la respuesta con las órdenes terminadas del día actual y sus datos relacionados
            res.status(200).json(respuesta);
        } catch (error) {
            console.error('Error al consultar la información de las órdenes terminadas:', error);
            next(error);
        }
    }

    // Estado TERMINADO HOY 2
    // async function terminadoHoy2(req, res, next) {
    //     const estado = 'terminado';
    
    //     try {
    //         // Consultar todas las órdenes terminadas
    //         const ordenesTerminadas = await db.queryEstados('ordenes', { estado });
    
    //         // Verificar si hay órdenes terminadas
    //         if (!ordenesTerminadas || ordenesTerminadas.length === 0) {
    //             return res.status(404).json({ mensaje: 'No se encontraron órdenes terminadas' });
    //         }
    
    //         // Obtener la fecha actual en formato YYYY-MM-DD
    //         const today = format(new Date(), 'yyyy-MM-dd');
    
    //         const respuesta = {
    //             ordenes: [],
    //             totalRecaudado: 0,
    //             numeroOrdenesHoy: 0,
    //             totalEfectivo: 0, // Inicializar el total pagado en efectivo
    //             totalTransferencia: 0 // Inicializar el total pagado por transferencia
    //         };
    
    //         // Consultar los datos relacionados para cada orden terminada y filtrar por fecha actual
    //         for (const orden of ordenesTerminadas) {
    //             const fechaOrden = format(new Date(orden.fecha_orden), 'yyyy-MM-dd');
    //             if (fechaOrden === today) {
    //                 // Consultar datos relacionados del cliente
    //                 const cliente = await db.uno('clientes', orden.cliente_id);
    
    //                 // Consultar datos relacionados del vehículo
    //                 const vehiculo = await db.uno('vehiculos', orden.vehiculo_id);
    
    //                 // Consultar datos relacionados del servicio
    //                 const servicio = await db.uno('servicios', orden.servicio_id);
    
    //                 respuesta.ordenes.push({
    //                     id: orden.id,
    //                     fechaOrden: orden.fecha_orden,
    //                     estado: orden.estado,
    //                     empleado: orden.empleado,
    //                     metodoDePago: orden.metodoDePago,
    //                     cliente: cliente[0],
    //                     vehiculo: vehiculo[0],
    //                     servicio: servicio[0]
    //                 }) 
    //                 // Sumar el costo del servicio al total recaudado
    //                 respuesta.totalRecaudado += parseFloat(servicio[0].costo);
    //                 respuesta.numeroOrdenesHoy += 1;
    
    //                 // Sumar al total pagado según el método de pago
    //                 if (orden.metodoDePago === 'Efectivo') {
    //                     respuesta.totalEfectivo += parseFloat(servicio[0].costo);
    //                 } else if (orden.metodoDePago === 'Transferencia') {
    //                     respuesta.totalTransferencia += parseFloat(servicio[0].costo);
    //                 }
    //             }
    //         }
    
    //         // Verificar si hay órdenes terminadas para el día actual
    //         if (respuesta.ordenes.length === 0) {
    //             return res.status(404).json({ mensaje: 'No se encontraron órdenes terminadas para el día actual' });
    //         }
    
    //         // Enviar la respuesta con las órdenes terminadas del día actual y sus datos relacionados
    //         res.status(200).json(respuesta);
    //         console.log(respuesta)
    //     } catch (error) {
    //         console.error('Error al consultar la información de las órdenes terminadas:', error);
    //         next(error);
    //     }
    // }

    // async function terminadoHoy(req, res, next) {
    //     const estado = 'terminado';
    
    //     try {
    //         // Consultar todas las órdenes terminadas
    //         const ordenesTerminadas = await db.queryEstados('ordenes', { estado });
    
    //         // Verificar si hay órdenes terminadas
    //         if (!ordenesTerminadas || ordenesTerminadas.length === 0) {
    //             return res.status(404).json({ mensaje: 'No se encontraron órdenes terminadas' });
    //         }
    
    //         // Obtener la fecha actual en formato YYYY-MM-DD
    //         const today = format(new Date(), 'yyyy-MM-dd');
    
    //         const respuesta = {
    //             ordenes: [],
    //             totalRecaudado: 0,
    //             numeroOrdenesHoy: 0,
    //             totalEfectivo: 0, // Inicializar el total pagado en efectivo
    //             // totalTransferencia: 0,
    //             totalNequi: 0,
    //             totalBancolombia: 0
    //         };
    
    //         // Consultar los datos relacionados para cada orden terminada y filtrar por fecha actual
    //         for (const orden of ordenesTerminadas) {
    //             const fechaOrden = format(new Date(orden.fecha_orden), 'yyyy-MM-dd');
    //             if (fechaOrden === today) {
                    
    //                 const cliente = await db.uno('clientes', orden.cliente_id);
    //                 const vehiculo = await db.uno('vehiculos', orden.vehiculo_id);
    //                 const servicio = await db.uno('servicios', orden.servicio_id);
        
    //                 respuesta.ordenes.push({
    //                     id: orden.id,
    //                     fechaOrden: orden.fecha_orden,
    //                     estado: orden.estado,
    //                     empleado: orden.empleado,
    //                     metododepago: orden.metododepago, // Asegúrate de que este nombre coincide con el nombre de la columna en tu tabla
    //                     cliente: cliente[0],
    //                     vehiculo: vehiculo[0],
    //                     servicio: servicio[0]
    //                 });
    
    //                 // Sumar el costo del servicio al total recaudado
    //                 const costoServicio = parseFloat(servicio[0].costo);
    //                 respuesta.totalRecaudado += costoServicio;
    //                 respuesta.numeroOrdenesHoy += 1;
    
    //                 // Sumar al total pagado según el método de pago
    //                 if (orden.metododepago === 'Efectivo') {
    //                     respuesta.totalEfectivo += costoServicio;
    //                 } else if (orden.metododepago === 'Nequi') {
    //                     respuesta.totalNequi += costoServicio;
    //                 } else if (orden.metododepago === 'Bancolombia') {
    //                     respuesta.totalBancolombia += costoServicio;
    //                 }
    //             }
    //         }
    
    //         // Verificar si hay órdenes terminadas para el día actual
    //         if (respuesta.ordenes.length === 0) {
    //             return res.status(404).json({ mensaje: 'No se encontraron órdenes terminadas para el día actual' });
    //         }
    
    //         // Enviar la respuesta con las órdenes terminadas del día actual y sus datos relacionados
    //         res.status(200).json(respuesta);
    //     } catch (error) {
    //         console.error('Error al consultar la información de las órdenes terminadas:', error);
    //         next(error);
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
        enEspera,
        enCurso,
        porPagar,
        terminado,
        terminadoHoy
        // agregar,
        // eliminar,

    }

}