const express = require('express');
const config = require('./config');
const morgan  = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const error = require('./red/errors');
const usuarios = require('./modulos/usuarios/rutas');
const ordenes = require('./modulos/ordenes/rutas')
const auth = require('./modulos/auth/rutas');
const vehiculos = require('./modulos/vehiculos/rutas');
const estados = require('./modulos/estados/rutas')


const app = express();


var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
}


//MIDDLEWARE
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//CONFIGURACION
app.set('port', config.app.port)

//RUTAS
app.use('/api/ordenes', ordenes);
app.use('/api/estados', estados);
app.use('/api/vehiculos', vehiculos);
// app.use('/api/ordenes', ordenes);
// app.use('/api/ordenes', ordenes);

app.use('/api/usuarios', usuarios);
app.use('/api/auth', auth);

// app.post('/api/ordens', ordenes2); esta es un modulo de prueba

app.use(error);

module.exports = app;
