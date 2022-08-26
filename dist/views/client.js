"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket = io();
const form = document.getElementById('chatform');
const messageInput = document.getElementById('write-message');
const messageContainer = document.getElementsByClassName('messages-chat');
var audio = new Audio('notf.mp3');
audio.autoplay = true;
audio.muted = true;
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add(position);
    messageContainer[0].appendChild(messageElement);
    if (position == 'message-left') {
        audio.muted = false;
        audio.play();
    }
    messageContainer[0].scrollIntoView({
        behavior: "smooth"
    });
};
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput["value"];
    append(`You: ${message}`, 'message-right');
    socket.emit('send', message);
    messageInput["value"] = '';
});
const name1 = prompt("What Should Your Friends Call You?");
socket.emit("new-user-joined", name1);
socket.on("userjoined", (name) => {
    append(`${name} joined the Chat`, 'message-centre');
});
socket.on("recieve", (data) => {
    append(`${data.name}: ${data.message}`, 'message-left');
});
socket.on("left", (name) => {
    append(`${name} left the chat`, 'message-centre');
});
