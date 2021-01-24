const http = require('http');

const socket = require('socket.io');
const ejs = require('ejs');

const path = require('path');
const app = require('./app');
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socket(server);

app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });
})

server.listen(port);
