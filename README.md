https://quizlive-fixit.vercel.app/create-quiz - for quiz creation
https://quizlive-fixit.vercel.app/join-quiz - for joining quiz

Live Quiz Platform
This project is a real-time quiz platform implemented using React.js for the frontend and FastAPI for the backend. Firebase is used for user authentication (Google Sign-In).

Key Features
1. User Authentication
Implemented Firebase Authentication to allow users to log in with their Google accounts, ensuring a smooth and secure login process.

2. Real-Time Quiz Synchronization
Integrated WebSocket for real-time communication between the quiz host and participants. WebSocket ensures seamless and instantaneous updates across the platform.
Broadcast quiz questions to all participants at the same time.
Display a joining message when participants join the quiz, visible to the host.

3. AI-Powered Question Generation
Integrated GEMINI API to allow quiz creators to generate AI-powered quiz questions based on a provided topic.
Quiz creators can either use AI-generated questions or manually add/edit quiz questions to maintain flexibility and control.

4. Timed Quiz Flow
Each quiz question is timed (e.g., 30 seconds per question).
Automatically collect answers when the timer expires and display the correct answer to participants.
Seamlessly transition to the next question after the timer ends, continuing until the quiz finishes.

5. Late Participant Handling
Implemented logic to handle participants joining late. Late participants can still join ongoing quizzes and be synced into the current state of the quiz.

6. Responsive and Robust UI
Designed using Material-UI (MUI) for a responsive and friendly user interface, providing a great experience on both mobile and desktop devices.

7. Smooth Quiz Creation Interface
Quiz creators can perform CRUD (Create, Read, Update, Delete) operations on quizzes.
Quiz creators can assign scores and time limits for each question, providing flexibility in quiz design.
The platform dynamically generates unique room IDs for each quiz to facilitate easy joining by participants.

for anyone cloning the respository follow the steps:
1) import the necessary packages
2) first run the backend using: python -m uvicorn app:app --reload
3) then run the frontned using: npm start

CORS Issues
If you encounter CORS errors, restart the backend server. You can also add console.log() statements in both the frontend and backend to debug the issue. Once the backend is restarted, the CORS issue should be resolved.

Additional Notes
Ensure that Firebase has been set up correctly in your project, and you've initialized Firebase in your frontend code.
The frontend and backend should be running simultaneously, with the backend running on a different port (e.g., 8000) and the frontend on port 3000.

Feel free to reach out if you encounter any issues while setting up the project. Happy coding!


