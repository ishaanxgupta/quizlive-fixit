
// import React, { useState, useEffect } from 'react';
// import { useParams,useLocation } from 'react-router-dom';
// import { 
//   Box, 
//   Card, 
//   CardContent, 
//   Typography, 
//   TextField, 
//   Button,
//   Snackbar,
//   Alert,
//   List,
//   ListItem,
//   ListItemText
// } from '@mui/material';

// const DisplayQuiz = () => {
//   const { roomId } = useParams();
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [quizData, setQuizData] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [score, setScore] = useState(0);
//   const [feedback, setFeedback] = useState('');
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [socket, setSocket] = useState(null);
//   const [leaderboard, setLeaderboard] = useState([]); // Leaderboard state
//   const location = useLocation();
//   const Username = location.state? location.state.name : 'Guest';
 

//   useEffect(() => {
//     const ws = new WebSocket(`ws://localhost:8000/ws/${roomId}`);

//     ws.onopen = () => {
//       console.log('Connected to WebSocket');
//       setSocket(ws);
//     };

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log('Quiz data received:', data);
//       if (data.quizData) {
//         setQuizData(data.quizData);
//       }
//       // Handle leaderboard updates
//           if(data.type === 'leaderboard_update'){
//         setLeaderboard(data.leaderboard);
//         console.log(data.leaderboard);
//           }
//     };

//     ws.onclose = () => {
//       console.log('WebSocket connection closed');
//     };

//     return () => {
//       ws.close();
//     };
//   }, [roomId]);

//   const nextQuestion = () => {
//     if (currentQuestion < quizData.questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//       setFeedback('');
//     }
//   };

//   const handleAnswerChange = (e) => {
//     setAnswers({
//       ...answers,
//       [currentQuestion]: e.target.value,
//     });
//   };

//   const submitAnswer = () => {
//     const userAnswer = answers[currentQuestion] || '';
//     const correctAnswer = quizData.answer[currentQuestion];
//     let newScore = 0;
//     console.log({leaderboard});
//     if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
//       setFeedback('Correct Answer!');
//       newScore = quizData.scores[currentQuestion];
//       setScore((prevScore) => prevScore + newScore);
//     } else {
//       setFeedback('Wrong Answer!');
//     }

//     // Send score submission to the server
//   //   if (socket) {
//   //     socket.send(JSON.stringify({
//   //         type: 'submit_answer',
//   //         name: Username, // Make sure this is the correct username
//   //         score: newScore, // Send the score for this question
//   //         room_id: roomId, // Use 'room_id' to match backend expectations
//   //     }));
//   // } else {
//   //     console.error('WebSocket is not connected');
//   // }

// //   fetch('http://localhost:8000/submit_answer/', {
// //     method: 'POST',
// //     headers: {
// //         'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify({
// //         name: Username,       // Ensure this matches the field in SubmitAnswerData
// //         score: newScore,
// //         room_id: roomId,
// //     }),
// // }).then(response => response.json())
// //   .then(data => {
// //       console.log('Server response:', data);
// //       // You can handle server responses here if needed
// //   });


//     setOpenSnackbar(true);
//   };

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };

//   if (!quizData) {
//     return <Typography variant="h6" align="center">Loading quiz...</Typography>;
//   }

//   return (
//     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: 2 }}>
//       <Card sx={{ minWidth: 300 }}>
//         <CardContent>
//           <Typography variant="h4" gutterBottom>
//             Quiz Room: {roomId}
//           </Typography>
//           <Typography variant="h6">
//             Question {currentQuestion + 1} of {quizData.questions.length}
//           </Typography>
//           <Typography variant="body1" sx={{ margin: '16px 0' }}>
//             {quizData.questions[currentQuestion]}
//           </Typography>

//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="Your answer"
//             value={answers[currentQuestion] || ''}
//             onChange={handleAnswerChange}
//             sx={{ marginBottom: 2 }}
//           />
//           <Button 
//             variant="contained" 
//             color="primary" 
//             onClick={submitAnswer} 
//             fullWidth
//             sx={{ marginBottom: 1 }}
//           >
//             Submit Answer
//           </Button>

//           {feedback && (
//             <Typography variant="body1" align="center" sx={{ color: feedback === 'Correct Answer!' ? 'green' : 'red' }}>
//               {feedback}
//             </Typography>
//           )}

//           {currentQuestion < quizData.questions.length - 1 ? (
//             <Button 
//               variant="outlined" 
//               onClick={nextQuestion} 
//               fullWidth
//             >
//               Next Question
//             </Button>
//           ) : (
//             <Typography variant="body1" align="center">
//               You've reached the end of the quiz.
//             </Typography>
//           )}

//           <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
//             Current Score: {score}
//           </Typography>

//           {/* Leaderboard Section */}
//           <Typography variant="h5" align="center" sx={{ marginTop: 4 }}>
//             Leaderboard
//           </Typography>
//           <List>
//             {leaderboard.map((participant, index) => (
//               <ListItem key={index}>
//                 <ListItemText primary={`${participant.name}: ${participant.score}`} />
//               </ListItem>
//             ))}
//           </List>
//         </CardContent>
//       </Card>

//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={3000}
//         onClose={handleCloseSnackbar}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={feedback === 'Correct Answer!' ? 'success' : 'error'}>
//           {feedback}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default DisplayQuiz;


import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

const DisplayQuiz = () => {
  const { roomId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [socket, setSocket] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]); // Leaderboard state
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false); // Disable submit button after submission
  const [timeLeft, setTimeLeft] = useState(0); // Timer for each question
  const location = useLocation();
  const Username = location.state ? location.state.name : 'Guest';
  
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${roomId}`);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Quiz data received:', data);
      if (data.quizData) {
        setQuizData(data.quizData);
        // Calculate time per question
        setTimeLeft((data.quizData.total_time)*60 / data.quizData.questions.length);
      }
      // Handle leaderboard updates
      if (data.type === 'leaderboard_update') {
        setLeaderboard(data.leaderboard);
        console.log(data.leaderboard);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // return () => {
    //   ws.close();
    // };
  }, [roomId]);

  // Timer logic for each question
  useEffect(() => {
    if (timeLeft === 0 && quizData) {
      nextQuestion(); // Automatically move to the next question if time runs out
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizData]);

  const nextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setFeedback('');
      setIsSubmitDisabled(false); 
      setTimeLeft(((quizData.total_time)*60) / quizData.questions.length); 
    }
  };

  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestion]: e.target.value,
    });
  };

  const submitAnswer = () => {
    const userAnswer = answers[currentQuestion] || '';
    const correctAnswer = quizData.answer[currentQuestion];
    let newScore = 0;

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      setFeedback('Correct Answer!');
      newScore = quizData.scores[currentQuestion];
      setScore((prevScore) => prevScore + newScore);
    } else {
      setFeedback('Wrong Answer!');
    }

    // Send score submission to the server (you can uncomment this for WebSocket handling)
    // if (socket) {
    //   socket.send(JSON.stringify({
    //       type: 'submit_answer',
    //       name: Username, 
    //       score: newScore,
    //       room_id: roomId,
    //   }));
    // }

    setOpenSnackbar(true);
    setIsSubmitDisabled(true); 
    setTimeout(() => {
      setOpenSnackbar(false); 
      nextQuestion(); 
    }, 2000);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (!quizData) {
    return <Typography variant="h6" align="center">Loading quiz...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: 2 }}>
      <Card sx={{ minWidth: 300 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Quiz Room: {roomId}
          </Typography>
          <Typography variant="h6">
            Question {currentQuestion + 1} of {quizData.questions.length}
          </Typography>
          <Typography variant="body1" sx={{ margin: '16px 0' }}>
            {quizData.questions[currentQuestion]}
          </Typography>

          <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
            Time Left: {timeLeft} seconds
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Your answer"
            value={answers[currentQuestion] || ''}
            onChange={handleAnswerChange}
            sx={{ marginBottom: 2 }}
            disabled={isSubmitDisabled} // Disable input if the answer is submitted
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={submitAnswer} 
            fullWidth
            sx={{ marginBottom: 1 }}
            disabled={isSubmitDisabled} // Disable submit button after submission
          >
            Submit Answer
          </Button>

          {feedback && (
            <Typography variant="body1" align="center" sx={{ color: feedback === 'Correct Answer!' ? 'green' : 'red' }}>
              {feedback}
            </Typography>
          )}

          {currentQuestion < quizData.questions.length - 1 ? (
            console.log()
          ) : (
            <Typography variant="body1" align="center">
              You've reached the end of the quiz. Thank you for your time!
            </Typography>
          )}

          <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
            Current Score: {score}
          </Typography>

          {/* Leaderboard Section */}
          <Typography variant="h5" align="center" sx={{ marginTop: 4 }}>
            Leaderboard
          </Typography>
          <List>
            {leaderboard.map((participant, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${participant.name}: ${participant.score}`} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={feedback === 'Correct Answer!' ? 'success' : 'error'}>
          {feedback}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DisplayQuiz;
