/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Avatar,
  Button,
  Container,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import AddIcCallIcon from '@material-ui/icons/AddIcCall';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';

import logo from './zlogo.png';
import dogs from './dogs.jpg';
import connect from './connect.jpg';
import InvitePeer from './InvitePeer';
import UserForm from './components/form/UserForm';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1.5%',
    marginBottom: 'auto',
    paddingTop: '5%',
    height: '100%',
  },
  gridContainer: {
    marginTop: '.5%',
  },
  elemsAterContainer: {
    padding: '4%',
  },
  gridItems: {
    padding: '1.5%',
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
  greet: {
    marginBottom: '2.5%',
  },
  dog: {
    width: '50%',
  },
}));

export function App() {
  const styles = useStyles();
  const [roomID, setRoomID] = useState('');
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    // RESTORE USER INFO AFTER REFRESH
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
  }, []);

  //  SETUP NEW USER WITHOUT
  const handleUserIdentity = (name, email) => {
    console.log(name, email);
    axios.post('/api/create-new-user', { name, email })
      .then((returnedUser) => {
        const { data } = returnedUser;
        // SET REQUIRED STATES
        setUserID(data._id);
        setEmail(data.email);
        setUser(data.name);
        console.log(returnedUser);
      });
  };

  //  GET ROOM ID FROM SERVER
  const handleGetRoomId = () => {
    axios.get('/api/get-room').then((roomId) => {
      setRoomID(roomId.data);
    });
  };

  //  RENDER FORM ONLY IF USER STATE !EXISTS
  const enterIdentity = (
    !userID && !user && (
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

  //  RENDER 'GET ROOM ID' ONLY IF USER AND USERID STATE EXISTS
  const greetUser = (
    user && userID
    && (
      <>
        <Typography variant="h4" className={styles.greet}>
          Hello
          {' '}
          {user}

          👋
        </Typography>

      </>
    )
  );

  const headerList = ['Chat', 'Catch Up', 'Connect'];
  //  MESSAGE BEFORE SHOWING INVITE PEER FORM
  const headers = headerList.map((word) => (
    !roomID && user
    && (
    <Grid container key={word}>
      <Grid item xs={12}>
        <List>
          <ListItem>
            <ListItemIcon>
              <AddIcCallIcon />
            </ListItemIcon>
            <ListItemText primary={word} />
          </ListItem>
        </List>
      </Grid>
    </Grid>
    )
  ));

  //  HEADER IMG
  const headerImg = (!roomID && user
  && <img className={styles.dog} src={connect} alt="connect img" />
  );

  //  SHOW GET ROOM Button
  const getRoomBtn = (!roomID && user
            && (
            <Grid container justifyContent="flex-end">
              <Button variant="contained" color="primary" onClick={handleGetRoomId}>Get a room 😏</Button>
            </Grid>
            )
  );

  // RENDER THESE ELEMENTS ONLY WHEN WE HAVE A ROOM ID
  const elemsAfterRoomId = (
    roomID
    && (
    <>
      <Grid container className={styles.elemsAterContainer}>

        <Grid item xs={12}>
          <Button startIcon={<ExitToAppTwoToneIcon />} href={`https://secret-oasis-97695.herokuapp.com/room/${roomID}`}>Go to room</Button>
        </Grid>

        <Grid item xs={12}>
          <CopyToClipboard text={roomID} onCopy={() => setCopied(true)}>
            <Button variant="outlined">
              <Typography variant="body1" align="center">COPY ROOM ID</Typography>
            </Button>
          </CopyToClipboard>
          {roomID}
        </Grid>
        <Grid item xs={12}>
          <InvitePeer userEmail={email} />
        </Grid>
      </Grid>

    </>
    )

  );

  return (
    <Container className={styles.container} maxWidth="lg">
      {/* // <> */}
      <AppBar color="primary" className={styles.appBar}>
        <Avatar alt="logo" src={logo} className={styles.logo} />
      </AppBar>
      <Grid container direction="row">

        <Grid item xs={6} className={styles.gridItems}>
          <Grid container direction="row">
            <Grid item>
              <Typography variant="h2" align="left" color="textSecondary" gutterBottom>
                Peer 2 Peer calls
              </Typography>
              <Typography variant="caption">
                Something like Zoom, slighty better
                {' '}
                <small>(Am Kidding🤪)</small>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <img className={styles.dog} src={dogs} alt="dog" />
              <img className={styles.dog} src={dogs} alt="dog" />
            </Grid>
            <Grid item xs={12}>

              <img className={styles.dog} src={dogs} alt="dog" />
              <img className={styles.dog} src={dogs} alt="dog" />
            </Grid>

          </Grid>

          {/* <img className={styles.dog} src={dogs} alt="dog" />
          <img className={styles.dog} src={dogs} alt="dog" />
          <img className={styles.dog} src={dogs} alt="dog" /> */}

        </Grid>

        <Grid item xs={6} className={styles.gridItems}>
          {roomID && (
          <Container className={styles.topGrid}>
            <Grid container>
              <Button href="http://localhost:3000" startIcon={<KeyboardBackspaceIcon />} />
            </Grid>
          </Container>
          )}

          <Grid container direction="column">
            {enterIdentity}
          </Grid>

          <Grid container justifyContent="flex-end">
            {greetUser}
            {getRoomBtn}
          </Grid>

          {headers}
          {headerImg}

          {elemsAfterRoomId}
        </Grid>
      </Grid>
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
      {/* </> */}
    </Container>
  );
}

export default App;
