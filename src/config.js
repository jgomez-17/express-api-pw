require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 4000,
    },
    jwt: {
        secret: process.env.JET_SECRET || 'notasecreta!!'
    },
    mysql: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'ejemplo',

    },

    postgree: {
        host: process.env.POSTGREE_DB_HOST || 'localhost',
        port: process.env.POSTGREE_DB_PORT || '5432',
        user: process.env.POSTGREE_DB_USER || 'root',
        password: process.env.POSTGREE_DB_PASSWORD || '',
        database: process.env.POSTGREE_DB_DATABASE || 'ejemplo',
    }
}