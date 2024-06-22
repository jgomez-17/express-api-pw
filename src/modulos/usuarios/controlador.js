const TABLA = 'usuarios';
const auth = require('../auth');

module.exports = function(dbInyectada){
    
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
    
    async function agregar2 (body) {

        const usuario = {
            id: body.id,
            nombre: body.nombre,
            activo: body.activo
        }

        const respuesta = await db.agregar(TABLA, usuario);
        var insertId = 0;

        if(body.id == 0) {
            insertId = respuesta.insertId;
        } else {
            insertId = body.id;
        }

        var respuesta2 = ''
        if(body.usuario || body.password) {
            respuesta2 = await auth.agregar ({
                id: insertId,
                usuario: body.usuario,
                password: body.password
            })
        }

        return respuesta2;
    }


    async function agregar(body) {
        try {
            const usuario = {
                nombre: body.nombre,
                activo: body.activo
            };
    
            let respuesta = await db.agregar(TABLA, usuario);
    
            // Comprobar si el id generado es 0 para decidir si se debe llamar a auth.agregar
            const insertId = respuesta.id; // PostgreSQL devuelve el id generado automáticamente
    
            let respuesta2 = '';
            if (body.usuario || body.password) {
                respuesta2 = await auth.agregar({
                    id: insertId,
                    usuario: body.usuario,
                    password: body.password
                });
            }
    
            return respuesta2;
        } catch (error) {
            throw error;
        }
    }
    
    
    function eliminar (body) {
        return db.eliminar(TABLA, body);
    }

    return {
        todos,
        uno,
        agregar,
        eliminar,
    }

}