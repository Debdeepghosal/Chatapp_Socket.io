"use strict";
const express = require("express");
const app = express();
const users = {};
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    },
});
app.use(express.static('./views'));
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
server.listen(3000, () => {
    console.log("Server running on port 3000...");
});
