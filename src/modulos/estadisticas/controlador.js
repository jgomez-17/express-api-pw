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

    // Nueva función para obtener las estadísticas mensuales
    // async function estadisticasMensuales(req, res, next) {
    //   const { mes, ano } = req.params;  // Espera parámetros mes y año en la solicitud

    //   try {
    //       // Total de órdenes
    //       const totalOrdenesQuery = `
    //         SELECT COUNT(*) as total
    //         FROM ${TABLA}
    //         WHERE MONTH(fecha_orden) = ? AND YEAR(fecha_orden) = ? AND estado = 'terminado'
    //       `;
    //       const totalOrdenesResult = await db.queryGeneral(totalOrdenesQuery, [mes, ano]);
    //       const totalOrdenes = totalOrdenesResult[0].total;

    //       // Total vendido
    //       const totalVendidoQuery = `
    //         SELECT SUM(s.costo) as total
    //         FROM ${TABLA} o
    //         JOIN servicios s ON o.servicio_id = s.id
    //         WHERE MONTH(o.fecha_orden) = ? AND YEAR(o.fecha_orden) = ? AND o.estado = 'terminado'
    //       `;
    //       const totalVendidoResult = await db.queryGeneral(totalVendidoQuery, [mes, ano]);
    //       const totalVendido = totalVendidoResult[0].total;

    //       // Cliente que generó más ingresos
    //       const clienteTopQuery = `
    //           SELECT c.nombre as cliente, SUM(s.costo) as total
    //           FROM ordenes o
    //           JOIN servicios s ON o.servicio_id = s.id
    //           JOIN clientes c ON o.cliente_id = c.id
    //           WHERE MONTH(o.fecha_orden) = ? AND YEAR(o.fecha_orden) = ? AND o.estado = 'terminado'
    //           GROUP BY c.id
    //           ORDER BY total DESC
    //           LIMIT 1
    //           `;
    //       const clienteTopResult = await db.queryGeneral(clienteTopQuery, [mes, ano]);
    //       const clienteTop = clienteTopResult[0];

    //       // Día con más ventas
    //       const diaMaxVentasQuery = `
    //           SELECT DATE(o.fecha_orden) as dia, SUM(s.costo) as total
    //           FROM ${TABLA} o
    //           JOIN servicios s ON o.servicio_id = s.id
    //           WHERE MONTH(o.fecha_orden) = ? AND YEAR(o.fecha_orden) = ? AND o.estado = 'terminado'
    //           GROUP BY DATE(o.fecha_orden)
    //           ORDER BY total DESC
    //           LIMIT 1
    //       `;
    //       const diaMaxVentasResult = await db.queryGeneral(diaMaxVentasQuery, [mes, ano]);
    //       const diaMaxVentas = diaMaxVentasResult[0];

    //       // Día con menos ventas
    //       const diaMinVentasQuery = `
    //           SELECT DATE(o.fecha_orden) as dia, SUM(s.costo) as total
    //           FROM ${TABLA} o
    //           JOIN servicios s ON o.servicio_id = s.id
    //           WHERE MONTH(o.fecha_orden) = ? AND YEAR(o.fecha_orden) = ? AND o.estado = 'terminado'
    //           GROUP BY DATE(o.fecha_orden)
    //           ORDER BY total ASC
    //           LIMIT 1
    //       `;
    //       const diaMinVentasResult = await db.queryGeneral(diaMinVentasQuery, [mes, ano]);
    //       const diaMinVentas = diaMinVentasResult[0];

    //       const estadisticas = {
    //           totalOrdenes,
    //           totalVendido,
    //           clienteTop,
    //           diaMaxVentas,
    //           diaMinVentas
    //       };

    //       res.json(estadisticas);
    //   } catch (err) {
    //       next(err);
    //   }
    // }

    // Nueva función para obtener las estadísticas mensuales


    async function estadisticasMensuales(req, res, next) {
        const { mes, ano } = req.params;  // Espera parámetros mes y año en la solicitud
    
        try {
            // Total de órdenes
            const totalOrdenesQuery = `
                SELECT COUNT(*) as total
                FROM ordenes
                WHERE EXTRACT(MONTH FROM fecha_orden) = $1 AND EXTRACT(YEAR FROM fecha_orden) = $2 AND estado = 'terminado'
            `;
            const totalOrdenesResult = await db.queryGeneral(totalOrdenesQuery, [mes, ano]);
            const totalOrdenes = totalOrdenesResult[0] ? totalOrdenesResult[0].total : 0;
    
            // Total vendido
            const totalVendidoQuery = `
                SELECT SUM(s.costo) as total
                FROM ordenes o
                JOIN servicios s ON o.servicio_id = s.id
                WHERE EXTRACT(MONTH FROM o.fecha_orden) = $1 AND EXTRACT(YEAR FROM o.fecha_orden) = $2 AND o.estado = 'terminado'
            `;
            const totalVendidoResult = await db.queryGeneral(totalVendidoQuery, [mes, ano]);
            const totalVendido = totalVendidoResult[0] ? totalVendidoResult[0].total : 0;
    
            // Cliente que generó más ingresos
            const clienteTopQuery = `
                SELECT c.nombre as cliente, SUM(s.costo) as total
                FROM ordenes o
                JOIN servicios s ON o.servicio_id = s.id
                JOIN clientes c ON o.cliente_id = c.id
                WHERE EXTRACT(MONTH FROM o.fecha_orden) = $1 AND EXTRACT(YEAR FROM o.fecha_orden) = $2 AND o.estado = 'terminado'
                GROUP BY c.nombre
                ORDER BY total DESC
                LIMIT 1
            `;
            const clienteTopResult = await db.queryGeneral(clienteTopQuery, [mes, ano]);
            const clienteTop = clienteTopResult[0] ? clienteTopResult[0] : { cliente: null, total: 0 };
    
            // Día con más ventas
            const diaMaxVentasQuery = `
                SELECT DATE_TRUNC('day', o.fecha_orden) as dia, SUM(s.costo) as total
                FROM ordenes o
                JOIN servicios s ON o.servicio_id = s.id
                WHERE EXTRACT(MONTH FROM o.fecha_orden) = $1 AND EXTRACT(YEAR FROM o.fecha_orden) = $2 AND o.estado = 'terminado'
                GROUP BY DATE_TRUNC('day', o.fecha_orden)
                ORDER BY total DESC
                LIMIT 1
            `;
            const diaMaxVentasResult = await db.queryGeneral(diaMaxVentasQuery, [mes, ano]);
            const diaMaxVentas = diaMaxVentasResult[0] ? diaMaxVentasResult[0] : { dia: null, total: 0 };
    
            // Día con menos ventas
            const diaMinVentasQuery = `
                SELECT DATE_TRUNC('day', o.fecha_orden) as dia, SUM(s.costo) as total
                FROM ordenes o
                JOIN servicios s ON o.servicio_id = s.id
                WHERE EXTRACT(MONTH FROM o.fecha_orden) = $1 AND EXTRACT(YEAR FROM o.fecha_orden) = $2 AND o.estado = 'terminado'
                GROUP BY DATE_TRUNC('day', o.fecha_orden)
                ORDER BY total ASC
                LIMIT 1
            `;
            const diaMinVentasResult = await db.queryGeneral(diaMinVentasQuery, [mes, ano]);
            const diaMinVentas = diaMinVentasResult[0] ? diaMinVentasResult[0] : { dia: null, total: 0 };
    
            const estadisticas = {
                totalOrdenes,
                totalVendido,
                clienteTop,
                diaMaxVentas,
                diaMinVentas
            };
    
            res.json(estadisticas);
        } catch (err) {
            console.error('Error en estadisticasMensuales:', err.message);
            next(err);
        }
    }

    return {
        todos,
        uno,
        agregar,
        eliminar,
        estadisticasMensuales
    }

}