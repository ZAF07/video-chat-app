/* eslint-disable max-len */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
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
    setRoom(location.pathname);

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
  const handleJoinRoom = () => {
    setGotVideo(true);
  };

  //  RENDER ALL PEER STREAMS
  const peerStreamsToCall = userStreamsToCall.map((peer) => <Video key={peer.peerID} stream={peer.stream} />);
  const peerStreamsToAnswer = userStreamsToAnswer.map((peer) => <Video key={peer.peerID} stream={peer.stream} />);

  return (
    <div>
      {`my id ${myId}`}

      <button type="button" onClick={handleJoinRoom}>Turn on camera</button>

      { gotVideo && <Video stream={myStream} muted /> }

      <div className={styles.main}>
        {userStreamsToCall && peerStreamsToCall}
        {peerStreamsToAnswer}
      </div>

    </div>
  );
}

export default Home;
