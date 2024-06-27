// const db = require('../../db/mysql');
// const ctrl = require('./controlador');

// module.exports = ctrl(db);

const db = require('../../db/postgree');
const ctrl = require('./controlador');

module.exports = ctrl(db);