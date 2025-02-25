from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Load fine-tuned model
MODEL_PATH = "./fine_tuned_model"
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForCausalLM.from_pretrained(MODEL_PATH)

# Initialize FastAPI
app = FastAPI()

class QueryRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat(request: QueryRequest):
    user_input = request.question

    # Tokenize input
    input_ids = tokenizer.encode(user_input, return_tensors="pt")

    # Generate response
    with torch.no_grad():
        output = model.generate(input_ids, max_length=150)
    
    response = tokenizer.decode(output[0], skip_special_tokens=True)
    return {"response": response}

@app.get("/")
def root():
    return {"message": "Job Chatbot API is running!"}
