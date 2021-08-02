import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 } from 'uuid';
import { resolve } from 'path';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import {} from 'dotenv/config';
import User from './models/user.mjs';

import { emailNotification } from './utils/mail.mjs';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const uuidPath = v4;

//  DB connection
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('dist'));
app.use(express.json());
app.use((cookieParser()));

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

//  API GET ROOM ID
app.get('/api/get-room', (req, res) => {
  const roomPath = uuidPath();
  res.json(roomPath);
  // res.sendFile('index.html')
});

// CHECK IF USER ALREADY ENTERED NAME AND EMAIL
app.get('/api/user', (req, res) => {
  if (req.cookies.userID) {
    console.log('this are the user deets => ', req.cookies);
    res.json(req.cookies);
  } else {
    res.json(null);
  }
});

// GET USER DATA (LOGGED IN)
app.post('/api/get-user', async (req, res) => {
  const { userId } = req.body;
  console.log('This is id -> ', userId);
  try {
    const userDataLoggedIn = await User.find({ _id: userId });
    console.log('was hsi we ==> ', userDataLoggedIn);
    res.json(userDataLoggedIn[0]);
  } catch (err) {
    console.log(err.message);
    res.json({ message: 'error getting user data logged in', error: err.message });
  }
});

// API CREATE NEW USER
app.post('/api/create-new-user', async (req, res) => {
  const user = req.body;
  console.log('running create new user');
  const newUser = new User(user);

  try {
    await newUser.save(user);
    const cookieOpts = { maxAge: 2 * 60 * 60 * 1000 };
    res.cookie('userID', newUser.id, { cookieOpts });
    console.log(newUser);
    res.json(newUser);
  } catch (err) {
    res.json({ message: 'failed to save new user', error: err.message });
  }
});

// API SEND EMAIL
app.post('/api/email/notif', (req, res) => {
  const { emailData: peersToEmailData } = req.body;
  console.log(peersToEmailData);

  peersToEmailData.forEach((peerData) => {
    console.log(peerData.roomID);
    console.log(peerData.receiverEmail);
    emailNotification(peerData.senderEmail, peerData.receiverEmail, peerData.roomID);
  });
});

io.on('connection', (socket) => {
  console.log('connected');

  // New user joining room sends back out thier ID and stream
  socket.on('join-room', ({ myId, room }) => {
    socket.join(room);
    socket.broadcast.to(room).emit('new-user-joined', myId);

    //  On user disconnect
    socket.on('disconnect', () => {
      socket.broadcast.to(room).emit('user-left', { userLeftId: myId });
    });
  });
});

httpServer.listen(process.env.PORT || 3000);
