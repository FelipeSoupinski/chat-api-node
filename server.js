const http = require('http');

const socket = require('socket.io');
const ejs = require('ejs');

const path = require('path');
const app = require('./app');
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socket(server);

const MessagesController = require('./controllers/messages-controller');

app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    MessagesController.getMessages().then(data => {
        socket.emit('previousMessages', data);
    });

    socket.on('sendMessage', data => {
        MessagesController.sendMessage(data);
        socket.broadcast.emit('receivedMessage', data);
    });
})

server.listen(port);
