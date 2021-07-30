import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 } from 'uuid';
import { resolve } from 'path';
import {} from 'dotenv/config';

import { emailNotification } from './utils/mail.mjs';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const uuidPath = v4;

app.use(express.static('dist'));
app.use(express.json());

app.get('/', (req, res) => {
  console.log('in lobby');
  res.sendFile(resolve('dist/main.html'));
});

app.get('/invite/peers', (req, res) => {
  console.log('invite peers');
  res.sendFile(resolve('dist/invite.html'));
});

app.get('/room/:room', (req, res) => {
  console.log('in room');
  res.sendFile(resolve('dist/room.html'));
});

app.get('/api/get-room', (req, res) => {
  const roomPath = uuidPath();
  res.json(roomPath);
  // res.sendFile('index.html')
});

app.post('/api/email/notif', (req, res) => {
  const { emailData: peersToEmailData } = req.body;
  console.log(peersToEmailData);

  peersToEmailData.forEach((peerData) => {
    console.log(peerData.roomID);
    console.log(peerData.receiverEmail);
    emailNotification('r18711@hotmail.com', peerData.receiverEmail, peerData.roomID);
  });
});

io.on('connection', (socket) => {
  console.log('connected');

  // New user joining room sends back out thier ID and stream
  // const usersInRoom = [];
  socket.on('join-room', ({ myId, room }) => {
    socket.join(room);
    socket.broadcast.to(room).emit('new-user-joined', myId);

    //  On use disconnect
    socket.on('disconnect', () => {
      socket.broadcast.to(room).emit('user-left', { userLeftId: myId });
    });
  });
});

httpServer.listen(process.env.PORT || 3000);
