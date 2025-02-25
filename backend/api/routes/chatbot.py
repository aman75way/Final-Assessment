from fastapi import APIRouter
from ai.inference import generate_response

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

@router.post("/")
def chat(user_input: str):
    response = generate_response(user_input)
    return {"response": response}
