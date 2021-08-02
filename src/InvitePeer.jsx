import React, { useState } from 'react';
import axios from 'axios';
import {
  Grid,
  FormControl,
  FormHelperText,
  InputLabel,
  Input,
  Typography,
  Container,
  Button,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
} from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    marginTop: '10%',
    paddingTop: '10%',
  },
  roomInput: {
    marginTop: '3%',
  },
  listOfPeersToAdd: {
    display: 'flex',
    justifyItems: 'flex-end',
    flexDirection: 'column',
  },
  topGrid: {
    display: 'flex',
  },
  listContainer: {
    marginTop: '8%',
  },
}));

function InvitePeer(props) {
  const styles = useStyles();

  const { userEmail } = props;

  const [peersToInvite, setPeersToInvite] = useState([]);
  const [peerEmail, setPeerEmail] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleAddPeer = () => {
    console.log('peeremail ', peerEmail);
    console.log(peersToInvite);
    console.log(roomId);
    if (peerEmail) {
      setPeersToInvite((prevState) => [...prevState, peerEmail]);
    }
    setPeerEmail('');
  };

  //  HANDLE UNCHECKING PEER TO Add
  const handleChecked = (peerToRemove) => {
    console.log('removing ', peerToRemove);
    setPeersToInvite((prevState) => {
      const newPeersToInvite = prevState.filter((peer) => peer !== peerToRemove);
      console.log('old peer list -> ', prevState);
      console.log('new peer list -> ', newPeersToInvite);
      return newPeersToInvite;
    });
  };

  //  HANDLE EMAIL NOTIFICATION
  const handleEmailNotif = () => {
    const emailData = [];

    peersToInvite.forEach((peer) => {
      const peerToEmail = {
        senderEmail: userEmail,
        receiverEmail: peer,
        roomID: roomId,
      };
      emailData.push(peerToEmail);
    });
    axios.post('/api/email/notif', { emailData });

    setPeersToInvite([]);
    window.location.href = `http://localhost:3000/room/${roomId}`;
  };

  const listOfPeersToAdd = peersToInvite.map((peer) => (
    <ListItem key={peer}>
      <FormControlLabel
        key={peer}
        control={(
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            name="checkedI"
            checked
            onChange={() => handleChecked(peer)}
          />
        )}
        label={peer}
      />
    </ListItem>

  ));

  return (
    <>
      {/* <Container className={styles.topGrid}>
        <Grid container>
          <Button href="http://localhost:3000" startIcon={<KeyboardBackspaceIcon />} />
        </Grid>
      </Container> */}

      <Container maxWidth="sm" className={styles.container}>
        <Grid container justifyContent="center" className={styles.grid}>
          <Typography align="center">
            Invite your friends
          </Typography>
          <FormControl>
            <InputLabel htmlFor="email-input">Email address</InputLabel>
            <Input id="email-input" value={peerEmail} aria-describedby="my-helper-text" onChange={(e) => setPeerEmail(e.target.value)} />
            <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
          </FormControl>
          <FormControl className={styles.roomInput}>
            <InputLabel htmlFor="room-input">Room ID</InputLabel>
            <Input id="room-input" aria-describedby="my-helper-text" onChange={(e) => setRoomId(e.target.value)} />
            <FormHelperText id="my-helper-text">Paste your room ID</FormHelperText>
          </FormControl>

          <Button onClick={handleAddPeer}>Add Peer</Button>
        </Grid>

        { peersToInvite.length > 0
        && (
        <Container className={styles.listContainer}>
          <Typography align="center">My Friends</Typography>
          <Grid container alignItems="flex-end" className={styles.listOfPeersToAdd}>

            <List>
              {listOfPeersToAdd}
            </List>

          </Grid>
          <Button variant="outlined" fullWidth onClick={handleEmailNotif}>Confirm</Button>
        </Container>
        )}

      </Container>

    </>

  );
}

export default InvitePeer;
