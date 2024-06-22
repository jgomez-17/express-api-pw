const pg = require('pg');
const config = require('../config');

const postgreconfig = {
    connectionString: process.env.DATABASE_URL,
    timezone: 'America/Bogota', 
    ssl: {
        rejectUnauthorized: true
    }
};

let pool;

function connectToPostgreSQL() {
    pool = new pg.Pool(postgreconfig);

    pool.on('error', (err, client) => {
        console.error('Error in PostgreSQL pool', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connectToPostgreSQL(); // Reconectar en caso de conexión perdida
        } else {
            throw err;
        }
    });

    pool.on('connect', (client) => {
        client.query('SET TIMEZONE="America/Bogota"');
        console.log('Connected to PostgreSQL database');
    });
}

connectToPostgreSQL();

const todos = async (tabla) => {
    const query = `SELECT * FROM ${tabla}`;
    return await executeQuery(query);
};

const uno = async (tabla, id) => {
    const query = `SELECT * FROM ${tabla} WHERE id = $1`;
    return await executeQuery(query, [id]);
};

const agregar = async (tabla, data) => {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
    const query = `INSERT INTO ${tabla} (${columns}) VALUES (${placeholders}) RETURNING *`;  // O RETURNING id si quieres solo el id

    try {
        const result = await pool.query(query, values);
        return result.rows[0];  // Asegúrate de devolver la fila completa
    } catch (error) {
        throw error;
    }
};


const eliminar = async (tabla, data) => {
    const query = `DELETE FROM ${tabla} WHERE id = $1 RETURNING *`;
    return await executeQuery(query, [data.id]);
};

// Función para hacer consultas
async function query2 (tabla, consulta) {
    try {

      const sql = `SELECT * FROM ${tabla} WHERE ${consulta.condition}`;
      const values = consulta.values;
  
      const result = await client.query(sql, values);
 n
  
      return result.rows[0]; // Devolver el primer resultado
    } catch (err) {
      console.error('Error en la consulta:', err);
      throw err;
    }
}

async function query3(tabla, consulta = { condition: '', values: [] }) {
    try {
        let sql = `SELECT * FROM ${tabla}`;
        const values = consulta.values;

        if (consulta.condition.trim() !== '') {
            sql += ` WHERE ${consulta.condition}`;
        }

        const result = await pool.query(sql, values);

        return result.rows;
    } catch (err) {
        console.error('Error en la consulta:', err);
        throw err;
    }
}



// Función para hacer consultas
async function query(tabla, consulta) {
    try {
        const sql = `SELECT * FROM ${tabla} WHERE ${consulta.condition}`;
        const values = consulta.values;

        const result = await pool.query(sql, values);

        return result.rows[0]; // Devolver el primer resultado
    } catch (err) {
        console.error('Error en la consulta:', err);
        throw err;
    }
}


async function queryEstados(tabla, consulta) {
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT * FROM ${tabla} WHERE estado = $1`, [consulta.estado]);
      return result.rows;
    } finally {
      client.release();
    }
}


const queryGeneral = async (sql, params) => {
    return await executeQuery(sql, params);
};

const buscarPorUsuario = async (tabla, usuario) => {
    const query = `SELECT * FROM ${tabla} WHERE usuario = $1`;
    return await executeQuery(query, [usuario]);
};

const actualizarEstadoOrden = async (tabla, datosActualizados, condicion) => {
    const setClause = Object.keys(datosActualizados).map((key, index) => `${key} = $${index + 1}`).join(", ");
    const whereClause = Object.keys(condicion).map((key, index) => `${key} = $${index + 1 + Object.keys(datosActualizados).length}`).join(" AND ");
    const values = [...Object.values(datosActualizados), ...Object.values(condicion)];
    const query = `UPDATE ${tabla} SET ${setClause} WHERE ${whereClause} RETURNING *`;
    return await executeQuery(query, values);
};

async function executeQuery(query, values = []) {
    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    pool,
    todos,
    uno,
    agregar,
    eliminar,
    query,
    query3,
    queryGeneral,
    queryEstados,
    buscarPorUsuario,
    actualizarEstadoOrden
};
