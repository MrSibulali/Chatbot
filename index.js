var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];
server.listen(process.env.PORT || 8080);
console.log('Server running...');
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
})

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log('connected: %s sockets connected ', connections.length);

    socket.on('disconnect', (data) => {
        //if(!socket.username) return;
        users.splice(users.indexOf(socket.username, 1));
        changeUserName();
        connections.splice(connections.indexOf(socket), 1);
        console.log('desconnected: %s sockets connected', connections.length);
    });
    
    socket.on('send message', (data) => {  
        if(data == 'hello' || data == 'hi' || data == 'hey') {
            io.sockets.emit('new message', {msg: data, user: socket.username, botName: 'Bot', botMessage: 'hello'});
        }
        else if(data == 'How old are you?' || data == 'How old are you' || data == 'how old are you?' ||data == 'how old are you') {
            io.sockets.emit('new message', {msg: data, user: socket.username, botName: 'Bot', botMessage: '1 year old'});
        }
        else if(data == 'are you smart?' || data == 'Are you smart' || data == 'Are you smart?' ||data == 'are you smart') {
            io.sockets.emit('new message', {msg: data, user: socket.username, botName: 'Bot', botMessage: 'Yes'});
        }
        else if(data == 'bye!' || data == 'Bye!' || data == 'bye' ||data == 'Bye') {
            io.sockets.emit('new message', {msg: data, user: socket.username, botName: 'Bot', botMessage: 'Fede!'});
        }
        else if(data == 'Fuck you!' || data == 'fuck you!' || data == 'Fuck you' ||data == 'fuck you') {
            io.sockets.emit('new message', {msg: data, user: socket.username, botName: 'Bot', botMessage: 'fuck you too!'});
        }
        else {
            io.sockets.emit('new message', {msg: data, user: socket.username, botName: 'Bot', botMessage: 'do not know the answer'});
        } 
        
    });

    socket.on('new user', (data, callback) => {   
        callback(true);
        socket.username = data;
        users.push(socket.username);
        changeUserName();
        //io.sockets.emit('new message', {msg: data});
    })

    function changeUserName() {
        io.sockets.emit('get users', users);
    }
})