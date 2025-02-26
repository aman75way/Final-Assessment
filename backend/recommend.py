from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
import json
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# Allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update this with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Supabase Credentials
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.get("/recommend-jobs/{user_id}")
def recommend_jobs(user_id: str):
    try:
        # Fetch user skills
        user_response = supabase.table("users").select("skills").eq("id", user_id).single().execute()
        user_data = user_response.data
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")

        user_skills = user_data["skills"]

        # Fetch all jobs from Supabase
        job_response = supabase.table("jobs").select("id, title, company, location, type, creator, skillsRequired").execute()
        jobs = job_response.data

        if not jobs:
            raise HTTPException(status_code=404, detail="No jobs found")

        # Convert job skills and user skills to text format
        job_texts = [" ".join(job.get("skillsRequired", [])) for job in jobs]
        user_text = " ".join(user_skills)

        # TF-IDF Vectorization
        vectorizer = TfidfVectorizer()
        skill_vectors = vectorizer.fit_transform([user_text] + job_texts)

        # Compute Cosine Similarity
        similarity_scores = cosine_similarity(skill_vectors[0], skill_vectors[1:]).flatten()

        # Rank jobs based on similarity scores
        ranked_jobs = sorted(zip(jobs, similarity_scores), key=lambda x: x[1], reverse=True)

         # Get top 5 jobs
        top_jobs = [{
            "id": job["id"],
            "title": job["title"],
            "company": job["company"],
            "location": job["location"],
            "type": job["type"],
            "skillsRequired": job.get("skillsRequired", []),  # Include required skills
            "score": score
        } for job, score in ranked_jobs[:5]]
        
        return {"recommended_jobs": top_jobs}

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
