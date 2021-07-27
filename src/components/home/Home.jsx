/* eslint-disable max-len */
/* eslint-disable no-undef */
import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

import styles from './home.module.css';
import Video from '../video/Video';

const socket = io();

function Home() {
  const [myId, setMyId] = useState(null);
  const [room, setRoom] = useState(null);
  const [myStream, setMyStream] = useState();
  const [gotVideo, setGotVideo] = useState(false);
  const [peersInRoom, setPeersInRoom] = useState([]);
  const [userStreamsToCall, setUserStreamsToCall] = useState([]);
  const [userStreamsToAnswer, setUserStreamsToAnswer] = useState([]);

  //  THIS IS ME
  const peer = new Peer();

  const addNewUser = (id, stream) => {
    const call = peer.call(id, stream);

    call.on('stream', (userVideoStream) => {
      console.log('this is the user stream i need to connect to => ', userVideoStream);
      console.log('user to coneect to id => ', id);
      setPeersInRoom((prevState) => [...prevState, { newUserID: call }]);
      setUserStreamsToCall((prevState) => [...prevState, { stream: userVideoStream, peerID: id }]);
    });

    call.on('close', () => {
      //  REMOVE PEER FROM ROOM

    });

    socket.on('user-left', ({ userLeftId }) => {
      console.log(`${userLeftId} left room, disconnect please`);

      setUserStreamsToCall((prevState) => {
        const newState = prevState.filter((obj) => obj.peerID !== userLeftId);
        return newState;
      });
    });
  };

  useEffect(() => {
    setRoom(location.pathname);

    // GET MY PEER ID
    peer.on('open', (id) => {
      console.log(id);
      setMyId(id);
      //  SEND MY PEER ID TO SOCKET FOR OTHER USER TO GET
      socket.emit('join-room', { myId: id, room });
    });

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      console.log('THIS IS MY STREAM -=-> ', stream);
      setMyStream(stream);

      //  LISTEN FOR INCOMING CALL EVENT
      peer.on('call', (call) => {
        call.answer(stream);
        call.on('stream', (streamToAnswer) => {
          console.log('this is the user who called me, stream => ', streamToAnswer);
          setUserStreamsToAnswer((prevState) => [...prevState, streamToAnswer]);
        });
      });

      //  HANDLE EVENT WHEN A NEW USER JOINS THE ROOM
      socket.on('new-user-joined', (newUserID) => {
        addNewUser(newUserID, stream);
        console.log('CALLING NEW USER --> ', newUserID);
      });
    });
  }, []);

  //  SEND MY ID ALONG WITH JOINING THE ROOM
  const handleJoinRoom = () => {
    setGotVideo(true);
  };

  //  RENDER ALL PEER STREAMS
  const peerStreamsToCall = userStreamsToCall.map((stream) => <Video key={stream.peerID} stream={stream.stream} />);
  const peerStreamsToAnswer = userStreamsToAnswer.map((stream) => <Video stream={stream} />);

  return (
    <div>
      {`my id ${myId}`}

      <button type="button" onClick={handleJoinRoom}>Turn on camera</button>

      { gotVideo && <Video stream={myStream} /> }

      <div className={styles.main}>
        {userStreamsToCall && peerStreamsToCall}
        {peerStreamsToAnswer}
      </div>

    </div>
  );
}

export default Home;
