import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 } from 'uuid';
import { resolve } from 'path';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const uuidPath = v4;

app.use(express.static('dist'));

app.get('/', (req, res) => {
  console.log('in lobby');
  res.sendFile(resolve('dist/main.html'));
});

app.get('/:room', (req, res) => {
  console.log('in room');
  res.sendFile(resolve('dist/room.html'));
});

app.get('/api/get-room', (req, res) => {
  const roomPath = uuidPath();
  res.json(roomPath);
  // res.sendFile('index.html')
});

io.on('connection', (socket) => {
  console.log('connected');

  // New user joining room sends back out thier ID and stream
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
