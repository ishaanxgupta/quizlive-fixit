// import React,{useState} from 'react'
// import { useNavigate } from 'react-router-dom';

// function JoinQuiz() {

//     const [roomId, setRoomId] = useState('');
//     const navigate = useNavigate();

//     const joinQuiz = () => {
//       if (roomId) {
//       navigate(`/quiz/${roomId}`);
//       }
// }

//   return (
//     <div>
//        <h1>Join a Quiz</h1>
//       <input
//         type="text"
//         placeholder="Enter Room ID"
//         value={roomId}
//         onChange={(e) => setRoomId(e.target.value)}
//       />
//       <button onClick={joinQuiz}>Join Quiz</button>
//     </div>
//   );
// };

// export default JoinQuiz

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// function JoinQuiz() {
//   const [roomId, setRoomId] = useState('');
//   const [socket, setSocket] = useState(null);
//   const [connectionError, setConnectionError] = useState(null);
//   const navigate = useNavigate();

//   const joinQuiz = () => {
//     if (roomId) {
//       const ws = new WebSocket(`ws://localhost:8000/ws/${roomId}`);

//       ws.onopen = () => {
//         console.log('Connected to WebSocket server');
//         setSocket(ws); 
//         setConnectionError(null); 
//         navigate(`/quiz/${roomId}`);
//       };

//       ws.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         console.log('Received message from server:', data);

//         if (data.quizData) {
//           navigate(`/quiz/${roomId}`, { state: { quizData: data.quizData } });
//         } else {
//           console.log('No quiz data received yet');
//         }
//       };

//       ws.onclose = () => {
//         console.log('WebSocket connection closed');
//       };

//       ws.onerror = (error) => {
//         console.log('WebSocket error:', error);
//         setConnectionError('Error connecting to the WebSocket server');
//       };
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (socket) {
//         socket.close();
//       }
//     };
//   }, [socket]);

//   return (
//     <div>
//       <h1>Join a Quiz</h1>
//       <input
//         type="text"
//         placeholder="Enter Room ID"
//         value={roomId}
//         onChange={(e) => setRoomId(e.target.value)}
//       />
//       <button onClick={joinQuiz}>Join Quiz</button>

//       {connectionError && <p style={{ color: 'red' }}>{connectionError}</p>}
//     </div>
//   );
// }

// export default JoinQuiz;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box 
} from '@mui/material';

const JoinQuiz = () => {
  const [roomId, setRoomId] = useState('');
  const [name,setName] = useState('');
  const [socket, setSocket] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const navigate = useNavigate();

  const joinQuiz = () => {
    if (roomId && name) {
      const ws = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'join', name, roomId }));
        console.log('Connected to WebSocket server');
        setSocket(ws); 
        setConnectionError(null); 

        fetch('http://localhost:8000/join_quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, roomId }), // Send participant's name and roomId
        })
        .then(response => response.json())
        .then(data => {
          console.log({name,roomId});
          console.log('Participant added to the backend:', data);
        })
        .catch(error => {
          console.error('Error adding participant:', error);
        });

        navigate(`/quiz/${roomId}`, { state: { name } });
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message from server:', data);

        if (data.quizData) {
          // navigate(`/quiz/${roomId}`, { state: { quizData: data.quizData, name:name } });
        } else {
          console.log('No quiz data received yet');
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      ws.onerror = (error) => {
        console.log('WebSocket error:', error);
        setConnectionError('Error connecting to the WebSocket server');
      };
    }
  };

  // useEffect(() => {
  //   return () => {
  //     if (socket) {
  //       socket.close();
  //     }
  //   };
  // }, [socket]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ minWidth: 300, padding: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Join a Quiz
          </Typography>
          <TextField
            fullWidth
            label="Enter Room ID"
            variant="outlined"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
           <TextField
            fullWidth
            label="Enter Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={joinQuiz} 
            fullWidth
          >
            Join Quiz
          </Button>
          {connectionError && (
            <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
              {connectionError}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default JoinQuiz;
