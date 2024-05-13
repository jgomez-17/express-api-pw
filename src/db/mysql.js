const mysql = require('mysql');
const config = require('../config');
const { error } = require('../red/respuestas');


const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
}

let conexion;

function conMysql(){
    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) => {
        if(err) {
            console.log('[db err]', err);
            setTimeout(conMysql, 200);
        } else {
            console.log('Database Conected!!!')
        }
    })

    conexion.on('error', err => {
        console.log('[db err]', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            conMysql();
        } else {
            throw err;
        }
    })
}

conMysql();

function todos (tabla) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla}`, (error, result) => {
            return error ? reject(error) : resolve(result);
       })   
    });
}

function uno (tabla, id) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE id=${id}`, (error, result) => {
            return error ? reject(error) : resolve(result);   
        })   
     });
}

function agregar (tabla, data) {
    return new Promise((resolve, reject) => {
        conexion.query(`INSERT INTO ${tabla} SET ? ON DUPLICATE KEY UPDATE ?`, [data,data], (error, result) => {
            return error ? reject(error) : resolve(result);   
        })   
     });
}


function eliminar (tabla, data) {
    return new Promise((resolve, reject) => {
        conexion.query(`DELETE FROM ${tabla} WHERE id = ?`, data.id, (error, result) => {
            return error ? reject(error) : resolve(result);   
        })   
     });
}

 function query (tabla, consulta) {
     return new Promise((resolve, reject) => {
         conexion.query(`SELECT * FROM ${tabla} WHERE ?`, consulta, (error, result) => {
             return error ? reject(error) : resolve(result);   
         })   
      });
 }

 function queryEstados (tabla, consulta) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE ?`, consulta, (error, result) => {
            return error ? reject(error) : resolve(result);   
        })   
     });
}

// function actualizar(tabla, datosActualizados, condicion) {
//     return new Promise((resolve, reject) => {
//         conexion.query(`UPDATE ${tabla} SET ? WHERE ?`, [datosActualizados, condicion], (error, result) => {
//             return error ? reject(error) : resolve(result);
//         });
//     });
// }

function actualizarEstadoOrden(tabla, datosActualizados, condicion) {
    return new Promise((resolve, reject) => {
        conexion.query(`UPDATE ${tabla} SET ? WHERE ?`, [datosActualizados, condicion], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
    query,
    queryEstados,
    actualizarEstadoOrden
}