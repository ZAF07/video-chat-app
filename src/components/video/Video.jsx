import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardActionArea, CardMedia, Container, Typography,
} from '@material-ui/core';
// import styles from './video.module.css';

//  CUSTOM STYLES
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
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

function Video(props) {
  const [muteAudio, setMuteAudio] = useState(false);
  const styles = useStyles();
  const { stream, muteMe } = props;
  const s = useRef();

  useEffect(() => {
    muteMe ? setMuteAudio(true) : setMuteAudio(false);

    s.current.srcObject = stream;
  }, [props]);

  return (
    <Container className={styles.container}>

      <Card>
        <CardActionArea>
          <CardMedia component="video" ref={s} playsInline autoPlay muted={muteAudio} />
        </CardActionArea>
      </Card>

      {/* The video

      <video ref={s} playsInline autoPlay /> */}
    </Container>
  );
}

export default Video;
