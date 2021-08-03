/* eslint-disable max-len */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Avatar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import io from 'socket.io-client';

import { AddBoxTwoTone } from '@material-ui/icons';
import DrawerTab from '../DrawerTab';
import Video from '../video/Video';

const socket = io();

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  gridContainer: {
    padding: '.9%',
    paddingBottom: '4%',
    marginLeft: '3%',
    borderLeft: '2px solid #555',
    borderRight: '2px solid #555',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  chatText: {
    padding: '.5%',
  },
  chatArea: {
    height: '100vh',
    overflowY: 'auto',
  },
  chatInput: {
    marginTop: 'auto',
    // position: 'absolute',
    // top: '79%',
    // left: '-8%',

  },
  chatInputField: {
    width: '100%',
  },
  buttonSendText: {
    marginTop: '1.3%',
  },
  avatar: {
    marginRight: '15.5%',
  },
  list: {
    width: '100%',
  },
}));

function Home() {
  const styles = useStyles();

  const [myId, setMyId] = useState(null);
  const [userID, setUserID] = useState(null);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [room, setRoom] = useState(null);
  const [myStream, setMyStream] = useState();
  const [text, setText] = useState('');
  const [chatText, setChatText] = useState([]);
  const [chatFromDB, setChatFromDB] = useState([]);
  const [gotVideo, setGotVideo] = useState(false);
  const [peersInRoom, setPeersInRoom] = useState([]);
  const [userStreamsToCall, setUserStreamsToCall] = useState([]);
  const [userStreamsToAnswer, setUserStreamsToAnswer] = useState([]);

  //  THIS IS ME
  const peer = new Peer();

  const addNewUser = (id, stream) => {
    console.log('&&&&& Adding new user here &&&&&');
    const call = peer.call(id, stream);

    call.on('stream', (userVideoStream) => {
      console.log('this is the user stream i need to connect to => ', userVideoStream);
      console.log('user to coneect to id => ', id);

      setUserStreamsToCall((prevState) => {
        const newUserObj = { stream: userVideoStream, peerID: id };

        if (prevState) {
          console.log('previous users exits => ', prevState);
          for (let i = 0; i < prevState.length; i += 1) {
            console.log(prevState[i].peerID);
            console.log(newUserObj.peerID);
            if (prevState[i].peerID === newUserObj.peerID) {
              return [...prevState];
            }
          }
        }
        return [...prevState, newUserObj];
      });
    });
  };

  useEffect(() => {
    // CHECK IF USER ALREADY SIGNED IN

    if (!userID) {
      axios.get('/api/user')
        .then((userData) => {
          console.log(userData);
          const { data } = userData;
          if (data) {
            console.log(data.userID);
            // Set ID first
            setUserID(data.userID);
            axios.post('/api/get-user', { userId: data.userID })
              .then((returnedUserData) => {
                //  GOT THE LOGGED IN USER DATA
                const { data: loggedInUserData } = returnedUserData;
                console.log(loggedInUserData);
                //  SET NAME AND EMAIL
                setUser(loggedInUserData.name);
                setEmail(loggedInUserData.email);
              });
          }
        });
    }

    //  CHECK FOR MESSAGES AFTER RELOADING
    console.log(chatText);
    if (chatText.length < 1) {
      console.log('runing');
      axios.get('/api/chat')
        .then((chatData) => {
          console.log(chatData);
          const { data } = chatData;
          console.log(data[0].name);
          setChatFromDB([...data]);
        });
    }

    // GET MY PEER ID
    peer.on('open', (id) => {
      console.log(id);
      setMyId(id);
      //  SEND MY PEER ID TO SOCKET FOR OTHER USER TO GET
      socket.emit('join-room', { myId: id, room });
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      console.log('THIS IS MY STREAM -=-> ', stream);
      setMyStream(stream);

      //  LISTEN FOR INCOMING CALL EVENT
      peer.on('call', (call) => {
        //  GET ID OF PEER CALLING
        const peerToAnswerID = call.peer;
        call.answer(stream);
        call.on('stream', (streamToAnswer) => {
          console.log('this is the user who called me, stream => ', streamToAnswer);
          // setUserStreamsToAnswer((prevState) => [...prevState, streamToAnswer]);

          setUserStreamsToAnswer((prevState) => {
            const newUserToAnswerObj = { stream: streamToAnswer, peerID: peerToAnswerID };
            if (prevState) {
              for (let i = 0; i < prevState.length; i += 1) {
                if (prevState[i].peerID === newUserToAnswerObj.peerID) {
                  return [...prevState];
                }
              }
            }
            return [...prevState, newUserToAnswerObj];
          });
        });
      });

      //  HANDLE EVENT WHEN A NEW USER JOINS THE ROOM
      socket.on('new-user-joined', (newUserID) => {
        console.log('users in room array from server => ', newUserID);
        addNewUser(newUserID, stream);

        console.log('CALLING NEW USER --> ', newUserID);
      });

      // LISTEN FOR WHEN USERS LEAVE ROOM
      socket.on('user-left', ({ userLeftId }) => {
        console.log(`${userLeftId} left room, disconnect please`);
        //  LISTEN FOR WHEN USERS LEAVE ROOM
        setUserStreamsToCall((prevState) => {
          const newState = prevState.filter((obj) => obj.peerID !== userLeftId);
          return newState;
        });

        //  REMOVE PEERS YOU ANSWERED CALL FROM ONCE THEY LEAVE THE ROOM
        setUserStreamsToAnswer((prevState) => {
          if (prevState) {
            const newStreamAnsweredState = prevState.filter((obj) => obj.peerID !== userLeftId);
            return newStreamAnsweredState;
          }
          return [];
        });
      });
    });
  }, []);

  //  SEND MY ID ALONG WITH JOINING THE ROOM
  const handleJoinRoom = () => (gotVideo ? setGotVideo(false) : setGotVideo(true));

  //  SENDING TEXT CHAT
  const handleTextChat = () => {
    socket.emit('send-text-chat', { userName: user, text, room });
    // ADD TO CHAT TEXT STATE
    setChatText((prevState) => [...prevState, { name: user, text }]);
    setText('');
  };

  //  LISTENING FOR CHATS RECEIVED
  // socket.on('receive-text-chat', ({ userName: chatUserName, text: chat }) => setChatText((prevState) => [...prevState, { name: chatUserName, text: chat }]));

  socket.on('receive-text-chat', (data) => {
    setChatText((prevState) => {
      const newChatMsg = { name: data.userName, text: data.text };
      if (prevState) {
        for (let i = 0; i < prevState.length; i += 1) {
          if (prevState[i].text === newChatMsg.text) {
            return [...prevState];
          }
        }
      }
      return [...prevState, newChatMsg];
    });
  });

  //  RENDER ALL PEER STREAMS
  const peerStreamsToCall = userStreamsToCall.map((peer) => (
    <Grid item xs={12} md={6} key={peer.peerID}>
      <Video key={peer.peerID} stream={peer.stream} />
    </Grid>

  ));
  const peerStreamsToAnswer = userStreamsToAnswer.map((peer) => (
    <Grid item xs={12} md={6} key={peer.peerID}>
      <Video key={peer.peerID} stream={peer.stream} />
    </Grid>
  ));

  const myVideo = (
    gotVideo && (
    <Grid item xs={12} md={6}>
      <Video stream={myStream} muteMe />
    </Grid>
    )
  );

  //  RENDER CHATS
  const textChat = chatText.map((chat) => (
    <ListItem key={chat.name}>
      <Avatar className={styles.avatar}>{chat.name.substring(0, 1)}</Avatar>
      <ListItemText primary={chat.text} align="left" />
    </ListItem>
  ));

  //  RENDER CHATS FROM DB AFTER RELOADING
  const chatsFromDB = chatFromDB.map((item) => (
    <ListItem key={item._id}>
      <Avatar className={styles.avatar}>
        {/* {item.name ? item.name : item.text.sub} */}
        {item.name ? item.name.substring(0, 1) : item.text.substring(0, 1)}
      </Avatar>
      <ListItemText primary={item.text} align="left" />
    </ListItem>
  ));

  return (
    <Container className={styles.container} maxWidth="xl">
      {/* <Grid container direction="row"> */}

      <Grid item xs={12} md={8} lg={10}>
        {`my id ${myId}`}

        <button type="button" onClick={handleJoinRoom}>Turn on camera</button>

        <Grid container justifyContent="flex-start">

          {myVideo}

          {userStreamsToCall && peerStreamsToCall}

          {peerStreamsToAnswer}

        </Grid>

      </Grid>

      <Grid item xs={12} md={4} lg={2} className={styles.gridContainer}>
        <Grid container>
          <List className={styles.list}>
            { chatsFromDB}
            {textChat}

          </List>
        </Grid>

        <Grid container direction="column" alignself="flex-end" className={styles.chatInput}>
          <TextField
            className={styles.chatInputField}
            id="outlined-helperText"
            label="Message"
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button onClick={handleTextChat} className={styles.buttonSendText} variant="contained" fullWidth>Send</Button>
        </Grid>
      </Grid>

      <DrawerTab userEmail={email} roomId={room} />
    </Container>

  // {/* <div className={styles.main}>
  //   {userStreamsToCall && peerStreamsToCall}
  //   {peerStreamsToAnswer}
  // </div> */}
  );
}

export default Home;
