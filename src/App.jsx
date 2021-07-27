import axios from 'axios';
import React, { useState } from 'react';

export function App() {
  const [roomID, setRoomID] = useState('');

  //  GET ROOM ID FROM SERVER
  const handleGetRoomId = () => {
    axios.get('/api/get-room').then((roomId) => {
      setRoomID(roomId.data);
    });
  };
  return (
    <div>

      {roomID}

      {
        !roomID && <button type="button" onClick={handleGetRoomId}>Get room ID</button>
      }

      {
        roomID && <a href={`http://localhost:3000/${roomID}`}>Go to room</a>
      }
    </div>
  );
}

export default App;
