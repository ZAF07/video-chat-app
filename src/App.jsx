import axios from 'axios';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar, Avatar, Button, Container, Typography,
} from '@material-ui/core';
import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';

import logo from './zlogo.png';

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

  //  GET ROOM ID FROM SERVER
  const handleGetRoomId = () => {
    axios.get('/api/get-room').then((roomId) => {
      setRoomID(roomId.data);
    });
  };
  return (
    <Container className={styles.container} maxWidth="sm">
      <AppBar color="primary" className={styles.appBar}>
        <Avatar alt="logo" src={logo} className={styles.logo} />
      </AppBar>
      <Typography variant="h2" align="center" color="textSecondary" gutterBottom>
        Start making calls
      </Typography>
      {roomID}

      {
        !roomID && <Button variant="contained" color="primary" onClick={handleGetRoomId}>Get a room 😏</Button>
      }

      {/* {
        roomID && <Button startIcon={<ExitToAppTwoToneIcon />} href={`https://secret-oasis-97695.herokuapp.com/room/${roomID}`}>Go to room</Button>
      } */}
      {
        roomID
        && <Button startIcon={<ExitToAppTwoToneIcon />} href={`http://localhost:3000/room/${roomID}`}>Go to room</Button>
      }

      {
        roomID && (
        <CopyToClipboard text={`http://localhost:3000/room/${roomID}`} onCopy={() => setCopied(true)}>
          <Button variant="outlined">
            <Typography variant="body1">COPY ROOM ID</Typography>
          </Button>
        </CopyToClipboard>
        )
      }
    </Container>
  );
}

export default App;
