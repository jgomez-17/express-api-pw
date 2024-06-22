const TABLA = 'usuarios2';
const bcrypt = require('bcrypt');


module.exports = function(dbInyectada){
    
    let db = dbInyectada;

    if(!db) {
        db = require('../../db/mysql');
    }

    
    function uno (id) {
        return db.uno(TABLA, id);
    }

    function todos () {
        return db.todos(TABLA);
    }
    
    function agregar (body) {
        return db.agregar(TABLA, body);
    }
    
    function eliminar (body) {
        return db.eliminar(TABLA, body);
    }

    // async function login(usuario, contraseña) {
    //     try {
    //         // Buscar el usuario por nombre de usuario
    //         const user = await db.buscarPorUsuario(TABLA, usuario);
    
    //         if (!user) { // Corregido aquí
    //             throw new Error('Usuario no encontrado');
    //         }
    
    //         // Verificar la contraseña
    //         const match = await bcrypt.compare(contraseña, user.contraseña);
    //         if (!match) {
    //             throw new Error('Contraseña incorrecta');
    //         }
    
    //         // Autenticación exitosa, puedes devolver el usuario o un token
    //         return user;
    //     } catch (error) {
    //         throw new Error(error.message);
    //     }
    // }

    async function verificarUsuario(req, res) {
        const { usuario, contraseña } = req.body;
    
        try {
            // Buscar el usuario por nombre de usuario
            const user = await db.query(TABLA, { usuario });
    
            if (!user || user.length === 0) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
    
            // Verificar la contraseña (en este caso, asumimos que no hay cifrado de contraseñas)
            if (contraseña !== user[0].contraseña) {
                return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
            }
    
            // Autenticación exitosa
            const { nombre, rol } = user[0]; // Se incluye el nombre y el rol del usuario en la respuesta
            return res.status(200).json({ mensaje: 'Autenticación exitosa', nombre, rol });
        } catch (error) {
            console.error('Error al verificar el usuario:', error);
            return res.status(500).json({ mensaje: 'Error al procesar la solicitud' });
        }
    }
    
    
    
    

    return {
        uno,
        todos,
        agregar,
        eliminar,
        verificarUsuario
    }

}