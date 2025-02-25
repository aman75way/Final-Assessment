from fastapi import FastAPI
from routes import chatbot, jobs
from database import Base, engine

app = FastAPI()

# Initialize database
Base.metadata.create_all(bind=engine)

app.include_router(chatbot.router)
app.include_router(jobs.router)

@app.get("/")
def root():
    return {"message": "AI Job Portal API Running"}
