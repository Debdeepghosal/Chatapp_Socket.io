"use strict";
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const users = {};
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    },
});
app.use(express.static(__dirname + '/views'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});
io.on("connection", (socket) => {
    socket.on("new-user-joined", (name) => {
        users[socket.id] = name;
        socket.broadcast.emit("userjoined", users[socket.id]);
    });
    socket.on("send", message => {
        socket.broadcast.emit("recieve", { message: message, name: users[socket.id] });
    });
    socket.on("disconnect", message => {
        socket.broadcast.emit("left", users[socket.id]);
        delete users[socket.id];
    });
});
server.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});
