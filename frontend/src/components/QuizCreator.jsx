import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid2, 
  Box, 
  List, 
  ListItem, 
  Divider,
  IconButton,
  Snackbar
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import QuizParticipant from './QuizParticipant';

// Styles for better layout
const useStyles = makeStyles({
  root: {
    margin: '2rem auto',
    maxWidth: '1000px',
  },
  inputContainer: {
    marginBottom: '1.5rem',
  },
  button: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  questionCard: {
    marginTop: '1rem',
  },
  roomIdContainer: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
  },
});

const QuizCreator = () => {
  const classes = useStyles();
  const [quiz, setQuiz] = useState({
    topic: '',
    questions: [],
    answer: [],
    totalScore: 0,
    totalTime: 0,
    roomId: ''
  });
  const [question, setQuestion] = useState('');
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState('');
  const [aiTopic, setAiTopic] = useState(''); // Topic for AI-generated questions
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // New state for editing
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarOpen1, setSnackbarOpen1] = useState(false);
  const [snackbarOpen2, setSnackbarOpen2] = useState(false);
  const [participants, setParticipants] = useState([]);
  const ws = useRef(null);

  // const addQuestion = () => {
  //   setQuiz({
  //     ...quiz,
  //     questions: [...quiz.questions, { question, answer, score }],
  //     totalScore: quiz.totalScore + parseInt(score)
  //   });
  //   setQuestion('');
  //   setAnswer('');
  //   setScore(0);
  // };

  const addQuestion = () => {
    if (editIndex !== null) {
      // Edit the existing question
      const updatedQuestions = quiz.questions.map((q, index) =>
        index === editIndex ? { question, answer, score } : q
      );
      setQuiz({ 
        ...quiz, 
        questions: updatedQuestions,
        totalScore: updatedQuestions.reduce((acc, curr) => acc + parseInt(curr.score), 0)
      });
      setEditIndex(null);
    } else {
      // Add a new question
      setQuiz({
        ...quiz,
        questions: [...quiz.questions, { question, answer, score }],
        totalScore: quiz.totalScore + parseInt(score)
      });
    }
    
    setQuestion('');
    setAnswer('');
    setScore(0);
  };

  // Delete Question
  const deleteQuestion = (index) => {
    const updatedQuestions = quiz.questions.filter((q, i) => i !== index);
    setQuiz({ 
      ...quiz, 
      questions: updatedQuestions,
      totalScore: updatedQuestions.reduce((acc, curr) => acc + parseInt(curr.score), 0)
    });
  };

  // Edit Question (populate input fields with existing data)
  const editQuestion = (index) => {
    const q = quiz.questions[index];
    setQuestion(q.question);
    setAnswer(q.answer);
    setScore(q.score);
    setEditIndex(index); // Set the index of the question being edited
  };


  const generateRoomId = () => {
    const newRoomId = uuidv4();
    setQuiz({ ...quiz, roomId: newRoomId });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(quiz.roomId);
    setSnackbarOpen(true);
  };


  const createWebSocketConnection = (roomId) => {
    ws.current = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
    
    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };
    
    ws.current.onmessage = (event) => {
      console.log("Received message: ", event.data);
    };
    
    ws.current.onclose = () => {
      console.log("WebSocket closed");
    };
    
    ws.current.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };
  };

  const sendQuizData = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(quiz));
    } else {
      console.error("WebSocket is not open. Unable to send quiz data.");
    }
  };

  const fetchParticipants = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:8000/participants/${roomId}`);
      if (response.ok) {
        const participantsData = await response.json();
        setParticipants(participantsData);
      } else {
        console.error('Error fetching participants:', response.statusText);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const handleCreateQuiz = async () => {
    const quizData = {
      topic: quiz.topic,
      questions: quiz.questions.map(q => q.question),
      answer: quiz.questions.map(q => q.answer || ''),
      scores: quiz.questions.map(q => parseInt(q.score)),
      total_time: parseInt(quiz.totalTime),
      room_id: quiz.roomId || generateRoomId(),
    };

    try {
      const response = await fetch("http://localhost:8000/create_quiz/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });

      const data = await response.json();
      if (data.room_id) {
        createWebSocketConnection(data.room_id);
        sendQuizData();


        fetchParticipants(data.room_id);
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
    setSnackbarOpen1(true);
  };

  const handleStartQuiz = async () => {
    const response = await fetch(`http://localhost:8000/start_quiz/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room_id: quiz.roomId }),
    });

    const data = await response.json();
    console.log(data);
    setSnackbarOpen2(true);
  };

const fetchAiGeneratedQuestions = async () => {
  if (!aiTopic) {
    console.log("specify topic bro");
    return;
  }

  const requestData = {
      contents: [
          {
              parts: [
                  { text: `Generate 10 quiz questions and answer on the topic: ${aiTopic}. Only give questions and correct answer. Not a single word extra and give in format question-answer` }
              ]
          }
      ]
  };

  try {
    const response = await fetch("http://localhost:8000/generate_questions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();
    
    if (data.questions && data.questions.candidates && data.questions.candidates[0].content && data.questions.candidates[0].content.parts) {
      // Extract the full content from the API response
      const fullContent = data.questions.candidates[0].content.parts[0].text;
      const questionLines = fullContent
        .split("\n")
        .filter(line => line.trim() !== "");  

      // Extract the first 10 questions only
      const first10Questions = questionLines.slice(0, 10);
      setGeneratedQuestions(first10Questions);
    } else {
      console.error("Error fetching AI questions: unexpected response structure", data);
    }
  } catch (error) {
    console.error("Error fetching AI questions:", error);
  }
};


const handleAddAiQuestions = () => {
  // Iterate through each generated question, assuming the format is "Question - Answer"
  generatedQuestions.forEach(q => {
    // Split each entry on " - " to separate question and answer
    const [question, answer] = q.split(" - ");

    if (question && answer) {
      setQuiz(prevQuiz => ({
        ...prevQuiz,
        questions: [...prevQuiz.questions, { question: question.trim(), answer: answer.trim(), score: 1 }],
        totalScore: prevQuiz.totalScore + 1,
      }));
    }
  });
  
  setGeneratedQuestions([]);
};


  // useEffect(() => {
  //   return () => {
  //     if (ws.current) {
  //       ws.current.close();
  //     }
  //   };
  // }, []);

  useEffect(() => {
    let interval;
    if (quiz.roomId) {
      // Poll the participants list every 5 seconds
      interval = setInterval(() => fetchParticipants(quiz.roomId), 5000);
    }
    
    return () => clearInterval(interval);  // Cleanup the interval on component unmount
  }, [quiz.roomId]);

  return (  
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Create a Quiz
          </Typography>

          <Box className={classes.inputContainer}>
            <TextField
              fullWidth
              label="Quiz Topic"
              variant="outlined"
              value={quiz.topic}
              onChange={(e) => setQuiz({ ...quiz, topic: e.target.value })}
              className={classes.input}
            />
          </Box>

          <Box className={classes.inputContainer}>
            <TextField
              fullWidth
              label="Time (minutes)"
              type="number"
              variant="outlined"
              value={quiz.totalTime}
              onChange={(e) => setQuiz({ ...quiz, totalTime: e.target.value })}
            />
          </Box>

          <Typography variant="h6">Add Questions</Typography>
          <Box display="flex" alignItems="center" className={classes.inputContainer}>
            <TextField
              fullWidth
              label="Enter question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              sx={{ marginBottom: 2 }}
            />

            <TextField
              fullWidth
              label="Correct Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              sx={{ marginBottom: 2 }}
            />

            <TextField
              fullWidth
              label="Score"
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
          </Box>



          {/* <Button 
            variant="contained" 
            color="primary" 
            onClick={addQuestion} 
            className={classes.button}
          >
            Add Question
          </Button> */}

          <Button 
            variant="contained" 
            color="primary" 
            onClick={addQuestion} 
            className={classes.button}
          >
            {editIndex !== null ? 'Update Question' : 'Add Question'}
          </Button>

          <Divider />

          {/* <Typography variant="h6" className={classes.questionCard}>
            Questions List
          </Typography>
          <List>
            {quiz.questions.map((q, index) => (
              <ListItem key={index}>
                {q.question} (Correct Answer: {q.answer}, Score: {q.score})
              </ListItem>
            ))}
          </List>
          <Typography>Total Score: {quiz.totalScore}</Typography> */}

<Typography variant="h6" className={classes.questionCard}>
            Questions List
          </Typography>
          <List>
            {quiz.questions.map((q, index) => (
              <ListItem key={index}>
                <Grid2 container alignItems="center" spacing={2}>
                  <Grid2 item xs={8}>
                    {q.question} (Correct Answer: {q.answer}, Score: {q.score})
                  </Grid2>
                  <Grid2 item xs={4}>
                    <IconButton onClick={() => editQuestion(index)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => deleteQuestion(index)}>
                      <Delete />
                    </IconButton>
                  </Grid2>
                </Grid2>
              </ListItem>
            ))}
          </List>
          <Typography>Total Score: {quiz.totalScore}</Typography>

          <Divider />
          <br></br>

          <Typography variant="h6">Generate AI Questions</Typography>
          <br></br>
          <TextField
            fullWidth
            label="AI Topic"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <br></br>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={fetchAiGeneratedQuestions}
            className={classes.button}
          >
            Generate AI Questions
          </Button>

          {generatedQuestions.length > 0 && (
            <div>
              <Typography variant="h6">Generated Questions</Typography>
              <List>
                {generatedQuestions.map((q, index) => (
                  <ListItem key={index}>
                    {q}
                  </ListItem>
                ))}
              </List>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleAddAiQuestions}
                className={classes.button}
              >
                Add AI Questions
              </Button>
            </div>
          )}
          <br></br>
          <br></br>

          <Button 
            variant="contained" 
            onClick={generateRoomId} 
            className={classes.button}
          >
            Generate Room ID
          </Button>
          {quiz.roomId && (
            <Box className={classes.roomIdContainer}>
              <Typography>Room ID: {quiz.roomId}</Typography>
              <Button onClick={copyToClipboard} variant="outlined">Copy Room ID</Button>
            </Box>
          )}
<br></br>
<br></br>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateQuiz} 
            className={classes.button}
          >
            Create Quiz
          </Button>
<br></br>
<br></br>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleStartQuiz} 
            className={classes.button}
          >
            Start Quiz
          </Button>

          <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={() => setSnackbarOpen(false)}
        message="Room ID copied to clipboard!"
      />

        <Snackbar
        open={snackbarOpen1}
        autoHideDuration={1}
        onClose={() => setSnackbarOpen(false)}
        message="Quiz Created! :)"
      />

       <Snackbar
        open={snackbarOpen2}
        autoHideDuration={1000}
        onClose={() => setSnackbarOpen(false)}
        message="Quiz Broadcasted! Congrats!"
      />

{quiz.roomId && (
            <Box>
              <Typography variant="h6">Participants</Typography>
              <List>
                {participants.length > 0 ? (
                  participants.map((participant, index) => (
                    <ListItem key={index}>
                      {participant} - Joined
                    </ListItem>
                  ))
                ) : (
                  <Typography>No participants have joined yet</Typography>
                )}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
};

export default QuizCreator;

