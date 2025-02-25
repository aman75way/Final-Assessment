import json
from database import SessionLocal, Job

session = SessionLocal()
jobs = session.query(Job).all()

formatted_data = [{"title": job.title, "company": job.company, "location": job.location} for job in jobs]

with open("jobs.json", "w") as f:
    json.dump(formatted_data, f, indent=4)
