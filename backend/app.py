from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import random
import string
import requests
from pydantic import BaseModel

app = FastAPI()

# Handle CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins = ["*"]
)

# Store connected WebSockets (for broadcasting)
rooms = {}


class QuizData(BaseModel):
    topic: str
    questions: List[str]  # List of strings
    answer:List[str]
    scores: List[int]
    total_time: int
    room_id: str

class RoomID(BaseModel):
    room_id: str

# Define the Submit Answer data model
class SubmitAnswerData(BaseModel):
    room_id: str
    name: str
    score: int

print("hi")
@app.post("/create_quiz/")
async def create_quiz(quiz_data: QuizData):
    # Save the quiz data in-memory (or store in a database)
    print("quiz_data")
    rooms[quiz_data.room_id] = {
        "quiz_data": quiz_data,
        "participants": []
    }
    return {"status": "Quiz created successfully", "room_id": quiz_data.room_id}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()
    # name = await websocket.receive_text()  # Assume name is sent first
    
    # Add participant to the room
    if room_id in rooms:
        rooms[room_id]["participants"].append(websocket)
    else:
        await websocket.close()

    try:
        while True:
            # Keep the connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        # Remove the participant on disconnect
        rooms[room_id]["participants"].remove(websocket)


@app.post("/start_quiz/")
async def start_quiz(room_data: RoomID):
    room_id = room_data.room_id
    if room_id not in rooms:
        return {"error": "Room ID does not exist"}
    
    quiz_data = rooms[room_id]["quiz_data"]
    for participant in rooms[room_id]["participants"]:
        await participant.send_json({"quizData":quiz_data.dict()})

    return {"status": "Quiz broadcasted"}


# Define the expected structure for the request
class QuestionRequest(BaseModel):
    contents: list

GEMINI_API_URL = "your_url"
API_KEY = "your_key"

@app.post("/generate_questions/")
async def generate_questions(request: QuestionRequest):
    headers = {
        # "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "contents": request.contents
    }

    # Send the request to the Gemini API
    response = requests.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCNng2kz2XK4gy7_33GYccdtBDKl7IbGuc', headers=headers, json=payload)

    if response.status_code == 200:
        questions = response.json()
        return {"questions": questions}
    else:
        return {"error": f"Failed to generate questions. Status Code: {response.status_code}"}

     
# class Participant(BaseModel):
#     name: str
#     roomId: str

# @app.post("/join_quiz")
# async def join_quiz(participant: Participant):
#     room_id = participant.roomId
#     name = participant.name
    
#     # Add participant to the room
#     if room_id not in rooms:
#         rooms[room_id] = []
    
#     rooms[room_id].append(name)
#     return {"message": f"{name} joined room {room_id}", "participants": rooms[room_id]}

# @app.get("/participants/{room_id}", response_model=List[str])
# async def get_participants(room_id: str):
#     if room_id not in rooms:
#         raise HTTPException(status_code=404, detail="Room not found")
    
#     return rooms[room_id]
