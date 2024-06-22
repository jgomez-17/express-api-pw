const http = require('http');
const socketIo = require('socket.io');
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
const estados = require('./modulos/estados/rutas');
const lavadores = require('./modulos/lavadores/rutas');
const usuarios2 = require('./modulos/usuarios2/rutas');
const estadisticas = require('./modulos/estadisticas/rutas');
const acumulados = require('./modulos/acumulados/rutas');


const app = express();

//Socket.io
const server = http.createServer(app);
const io = socketIo(server);

// Conexión a Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

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
app.use('/api/lavadores', lavadores);
app.use('/api/estadisticas', estadisticas)
app.use('/api/usuarios', usuarios);
app.use('/api/auth', auth);
app.use('/api/acumulados', acumulados);

app.get('/hora', (req, res) => {
    const now = new Date();
    res.send(`La hora actual del servidor es: ${now.toLocaleString()}`);
});

// app.use('/api/usuarios2', usuarios2);
// app.post('/api/ordens', ordenes2); esta es un modulo de prueba

app.use(error);

module.exports = app;
