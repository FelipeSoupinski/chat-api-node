const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.static('public'));

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
const rotaUsuarios = require('./routes/usuarios');
const rotaMessages = require('./routes/messages');

const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended : false })); // Apenas dados simples
app.use(bodyParser.json()); // Apenas json de entrada no body

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // * pode ser substituido por https://mega.com.br por exemplo
    res.header(
        'Access-Control-Allow-Header', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization' // Cabeçalhos aceitados
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); // Métodos aceitados
        return res.status(200).send({});
    }

    next();
});

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);
app.use('/usuarios', rotaUsuarios);
app.use('/messages', rotaMessages);

app.use('/', (req, res) => {
    res.render('index.html');
});

app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;
