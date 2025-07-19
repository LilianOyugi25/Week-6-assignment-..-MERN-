// Written by Lilian Oyugi - oyugililian@gmail.com  
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow Kakamega/Bungoma farmers to connect

const server = http.createServer(app);
const io = socketIO(server, { 
  pingTimeout: 60000 // For slow rural networks
});

let farmers = {}; // Track active farmers

io.on('connection', (socket) => {
  console.log(`New connection from ${socket.handshake.address}`);

  socket.on('join', (data) => {
    farmers[socket.id] = data.name;
    io.emit('new_message', {
      sender: 'System',
      text: `${data.name} from ${data.location || 'Western Kenya'} joined`
    });
  });

  // Broadcast maize price updates
  socket.on('price_update', (data) => {
    if (data.crop === 'maize' || data.crop === 'sugarcane') {
      io.emit('new_message', {
        sender: farmers[socket.id],
        text: `New ${data.crop} price: KSh ${data.price} per kg`
      });
    }
  });

  socket.on('disconnect', () => {
    io.emit('new_message', {
      sender: 'System',
      text: `${farmers[socket.id]} left the chat`
    });
    delete farmers[socket.id];
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});
