const http = require('http');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');


const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname,'../public');

const port = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
   console.log('New user');

   socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
    socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));

    socket.on('createMessage',(message,callback)=>{
      console.log(message);
      io.emit('newMessage',generateMessage(message.from,message.text));
      callback('Got it');
      //  socket.broadcast.emit('newMessage',{
      //     from:message.from,
      //      text:message.text,
      //      createdAt:new Date()
      //  })
   });
   socket.on('disconnect',()=>{
      console.log('Client disconnected');
   });
});

server.listen(port,()=>{
   console.log(`Server running on ${port}`);
});
