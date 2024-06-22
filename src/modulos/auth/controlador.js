const TABLA = 'auth';
const bcrypt = require('bcrypt');
const auth = require('../../auth')

module.exports = function(dbInyectada){

    let db = dbInyectada;

    if(!db) {
        db = require('../../db/postgree');
    }

    // LOGIN
    // async function login2(usuario, password) {
    //     const data = await db.query(TABLA, {usuario: usuario});

    //     return bcrypt.compare(password, data.password)
    //         .then(resultado => {
    //             if(resultado === true) {
    //                 //generar token
    //                 return auth.asignarToken({...data})
    //             } else {
    //                 throw new Error('Informacion invalida');
    //             }
    //         })
    // }

    async function login3(usuario, password) {
        try {
            const data = await db.query(TABLA, { condition: 'usuario = $1', values: [usuario] });

            return bcrypt.compare(password, data.password)
                .then(resultado => {
                    if (resultado === true) {
                        //generar token
                        return auth.asignarToken({ ...data });
                    } else {
                        throw new Error('Informacion invalida');
                    }
                });
        } catch (error) {
            console.error('Error en la autenticación:', error);
            throw error;
        }
    }

    async function login(usuario, password) {
        try {
            // Consulta en la tabla 'auth' para obtener los datos de autenticación
            const authData = await db.query('auth', { condition: 'usuario = $1', values: [usuario] });

            // Comparar la contraseña
            return bcrypt.compare(password, authData.password)
                .then(async resultado => {
                    if (resultado === true) {
                        // Consulta en la tabla 'usuarios' para obtener los datos adicionales
                        const userData = await db.query('usuarios', { condition: 'id = $1', values: [authData.id] });

                        // Generar el token
                        const token = await auth.asignarToken({ id: authData.id });

                        // Devolver el token junto con otros datos
                        const response = {
                            token,
                            usuario: usuario,
                            nombre: userData.nombre,
                            rol: userData.rol,
                            activo: userData.activo
                        };

                        console.log(response); // Muestra los datos en la consola del backend
                        return response;

                    } else {
                        throw new Error('Información inválida');
                    }
                });
        } catch (error) {
            console.error('Error en la autenticación:', error);
            throw error;
        }
    }






    async function agregar (data) {

        const authData = {
            id: data.id,
        }

        if(data.usuario) {
            authData.usuario = data.usuario
        }

        if(data.password) {
            authData.password = await bcrypt.hash(data.password.toString(), 3)
        }

        return db.agregar(TABLA, authData);
    }

    return {
        agregar,
        login,
    }
}