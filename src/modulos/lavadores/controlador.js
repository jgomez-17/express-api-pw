const TABLA = 'lavadores';

module.exports = function(dbInyectada){
    
    let db = dbInyectada;

    if(!db) {
        db = require('../../db/mysql');
    }

    function todos () {
        return db.todos(TABLA);
    }
    
    function uno (id) {
        return db.uno(TABLA, id);
    }
    
     function agregar (body) {
         return db.agregar(TABLA, body);
     }
    
    function eliminar (body) {
        return db.eliminar(TABLA, body);
    }

    //Actualiza el estado de los lavadores
    cambiarEstadoLavador = async (req, res) => {
        const { lavadorId, newStatus } = req.body;
    
        try {
            // Actualizar el estado de la orden y el método de pago en la base de datos
            await db.actualizarEstadoOrden('lavadores', { activo: newStatus }, { id: lavadorId });
    
            console.log('Estado del lavador actualizado');
            res.status(200).send('Estado del lavador actualizado');
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
            res.status(500).send('Error al actualizar el estado');
        }
     };

    return {
        todos,
        uno,
        agregar,
        eliminar,
        cambiarEstadoLavador,
    }

}