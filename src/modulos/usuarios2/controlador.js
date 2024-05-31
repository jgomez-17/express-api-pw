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
    
    function agregar (body) {
        return db.agregar(TABLA, body);
    }
    
    function eliminar (body) {
        return db.eliminar(TABLA, body);
    }

    async function login(usuario, contraseña) {
      try {
          // Buscar el usuario por nombre de usuario
          const user = await db.buscarPorUsuario(TABLA, usuario);

          if (!usuario) {
              throw new Error('Usuario no encontrado');
          }

          // Verificar la contraseña
          const match = await bcrypt.compare(contraseña, user.contraseña);
          if (!match) {
              throw new Error('Contraseña incorrecta');
          }

          // Autenticación exitosa, puedes devolver el usuario o un token
          return user;
      } catch (error) {
          throw new Error(error.message);
      }
  }

    return {
        uno,
        agregar,
        eliminar,
        login
    }

}