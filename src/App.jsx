import axios from 'axios';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Avatar,
  Button,
  Container,
  Typography,
  Grid,
} from '@material-ui/core';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';

import io from 'socket.io-client';
import logo from './zlogo.png';
import InvitePeer from './InvitePeer';
import UserForm from './components/form/UserForm';

const socket = io();

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingTop: '10%',
    height: '100%',
  },
  logo: {
    height: '3rem',
    width: '3rem',
    marginLeft: '1.5%',
  },
  appBar: {
    paddingTop: '.5%',
    paddingBottom: '.5%',
  },
  move: {
    marginLeft: '10%',
    padding: '3%',
  },
}));

export function App() {
  const styles = useStyles();
  const [roomID, setRoomID] = useState('');
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);

  // //  CREATE NEW USER
  // const handleCreateNewUser = () => {
  //   axios.post('/api/create-new-user', { name: user, email })
  //     .then(returnedUser => {
  //       log
  //     })
  // };

  //  SET USER WITHOUT DB
  const handleUserIdentity = (name, email) => {
    console.log(name, email);
    axios.post('/api/create-new-user', { name, email })
      .then((returnedUser) => {
        const { data } = returnedUser;
        setUser(data.name);
        setEmail(data.name);
        console.log(returnedUser);
      });

    //  SEND USER DATA TO USER ON DIFF URL
    socket.emit('my-data', { user, email });
  };

  //  GET ROOM ID FROM SERVER
  const handleGetRoomId = () => {
    axios.get('/api/get-room').then((roomId) => {
      setRoomID(roomId.data);
    });
  };

  //  RENDER FORM ONLY IF USER STATE !EXISTS
  const enterIdentity = (
    !user
    && (
    <>
      <Typography variant="h3">
        Hello there 😎
      </Typography>
      <Typography variant="h6">
        You are?
      </Typography>
      <UserForm addNewUser={handleUserIdentity} />
    </>
    )

  );

  //  RENDER 'GET ROOM ID' ONLY IF USER STATE EXISTS
  const getRoom = (
    user
    && <Button variant="contained" color="primary" onClick={handleGetRoomId}>Get a room 😏</Button>
  );

  // RENDER THESE ELEMENTS ONLY WHEN WE HAVE A ROOM ID
  const elemsAfterRoomId = (
    roomID
    && (
    <>

      <Button startIcon={<ExitToAppTwoToneIcon />} href={`https://secret-oasis-97695.herokuapp.com/room/${roomID}`}>Go to room</Button>
      <CopyToClipboard text={roomID} onCopy={() => setCopied(true)}>
        <Button variant="outlined">
          <Typography variant="body1">COPY ROOM ID</Typography>
        </Button>
      </CopyToClipboard>
      <InvitePeer />
    </>
    )

  );

  return (
    <Container className={styles.container} maxWidth="sm">
      <AppBar color="primary" className={styles.appBar}>
        <Avatar alt="logo" src={logo} className={styles.logo} />
      </AppBar>

      {roomID && (
      <Container className={styles.topGrid}>
        <Grid container>
          <Button href="http://localhost:3000" startIcon={<KeyboardBackspaceIcon />} />
        </Grid>
      </Container>
      )}

      <Typography variant="h2" align="center" color="textSecondary" gutterBottom>
        Peer 2 Peer calls
      </Typography>
      {roomID}
      {enterIdentity}

      {getRoom}
      {elemsAfterRoomId}
      {/* {
        roomID && <Button startIcon={<ExitToAppTwoToneIcon />} href={`https://secret-oasis-97695.herokuapp.com/room/${roomID}`}>Go to room</Button>
      }
      {
        roomID && (
        <CopyToClipboard text={roomID} onCopy={() => setCopied(true)}>
          <Button variant="outlined">
            <Typography variant="body1">COPY ROOM ID</Typography>
          </Button>
        </CopyToClipboard>
        )
      }
      {roomID && <InvitePeer />} */}

      {/* {
        roomID
        && <Button startIcon={<ExitToAppTwoToneIcon />} href={`http://localhost:3000/room/${roomID}`}>Go to room</Button>
      } */}

      {/* {
        roomID && (
        <CopyToClipboard text={`http://localhost:3000/room/${roomID}`} onCopy={() => setCopied(true)}>
          <Button variant="outlined">
            <Typography variant="body1">COPY ROOM ID</Typography>
          </Button>
        </CopyToClipboard>
        )
      } */}
    </Container>
  );
}

export default App;
