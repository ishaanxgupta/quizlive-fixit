import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import QuizCreator from './components/QuizCreator';
import JoinQuiz from './components/JoinQuiz';
import DisplayQuiz from './components/DisplayQuiz';
import Login from './views/Login'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path="/create-quiz" element={<QuizCreator />} />
          <Route path="/join-quiz" element={<JoinQuiz />} />
          <Route path="/quiz/:roomId" element={<DisplayQuiz />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

