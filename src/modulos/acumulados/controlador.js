const TABLA = 'acumulados';
const moment = require('moment-timezone');

module.exports = function(dbInyectada, io){
    
    let db = dbInyectada;
    
    if(!db) {
        db = require('../../db/postgree');
    }
    
    function todos () {
        return db.todos(TABLA);
    }

    const ZONA_HORARIA_LOCAL = 'America/Bogota'; // Cambia esto a tu zona horaria preferida
    
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


    async function insertarAcumulados(req, res, next) {
        try {
            const { venta_diaria, prontowash, servicios } = req.body.data;
    
            // Obtener la fecha actual en la zona horaria local y convertirla a UTC
            const hoyLocal = moment().tz(ZONA_HORARIA_LOCAL).startOf('day');
            const hoyUTC = hoyLocal.clone().tz('UTC');
            const diaAnteriorUTC = hoyLocal.clone().subtract(1, 'days').tz('UTC');
    
            // Formatear la fecha del día anterior como YYYY-MM-DD
            const diaAnteriorFormatted = diaAnteriorUTC.format('YYYY-MM-DD');
    
            // Consultar el registro del día anterior en UTC
            const consulta = {
                condition: 'DATE(fecha) = $1',
                values: [diaAnteriorFormatted]
            };
    
            const registroDiaAnterior = await db.query('acumulados', consulta);
    
            // Mostrar el registro del día anterior por consola si existe
            if (registroDiaAnterior) {
                console.log('Registro del día anterior:', registroDiaAnterior);
            } else {
                console.log('No se encontró un registro para el día anterior');
            }
    
            // Preparar el nuevo registro a insertar
            const nuevoRegistro = {
                venta_diaria,
                acum_venta_diaria: registroDiaAnterior ? registroDiaAnterior.acum_venta_diaria + venta_diaria : venta_diaria,
                prontowash,
                acum_prontowash: registroDiaAnterior ? registroDiaAnterior.acum_prontowash + prontowash : prontowash,
                servicios,
                acum_servicios: registroDiaAnterior ? registroDiaAnterior.acum_servicios + servicios : servicios,
                fecha: hoyUTC.toDate()
            };
    
            // Insertar el nuevo registro en la base de datos
            const resultadoInsercion = await db.agregar('acumulados', nuevoRegistro);
    
            // Responder al cliente con el nuevo registro creado
            res.status(201).json(resultadoInsercion);
            console.log(resultadoInsercion)
        } catch (err) {
            // Manejar errores
            console.error('Error al insertar acumulados:', err);
            res.status(500).json({ error: 'Error al insertar acumulados' });
        }
    }
 
    async function obtenerRegistrosMesActual(req, res, next) {
        try {
            // Obtener la fecha actual en la zona horaria local
            const fechaActualLocal = moment().tz(ZONA_HORARIA_LOCAL);

            // Obtener el primer día del mes actual en UTC
            const primerDiaMesActual = fechaActualLocal.clone().startOf('month').tz('UTC').format('YYYY-MM-DD');
            
            // Obtener el último día del mes actual en UTC
            const ultimoDiaMesActual = fechaActualLocal.clone().endOf('month').tz('UTC').format('YYYY-MM-DD');
            
            // Construir la consulta para obtener los registros del mes actual
            const consulta = {
                condition: 'DATE(fecha) >= $1 AND DATE(fecha) <= $2',
                values: [primerDiaMesActual, ultimoDiaMesActual]
            };
            
            // Realizar la consulta utilizando la función query3
            const registrosMesActual = await db.query3(TABLA, consulta);

            // Responder al cliente con los registros del mes actual
            res.status(200).json(registrosMesActual);
        } catch (err) {
            // Manejar errores
            console.error('Error al obtener registros del mes actual:', err);
            res.status(500).json({ error: 'Error al obtener registros del mes actual' });
        }
    }

    
    
    return {
        todos,
        uno,
        agregar,
        eliminar,
        query,
        insertarAcumulados,
        obtenerRegistrosMesActual
    }
}