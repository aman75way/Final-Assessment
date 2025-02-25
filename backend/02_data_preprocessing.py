import json

# Load scraped job data
with open("scraped_jobs.json", "r") as f:
    jobs = json.load(f)

# Remove empty job listings
jobs = [job for job in jobs if job["title"] and job["company"]]

# Function to generate QA pairs
def generate_qa(job):
    title = job["title"]
    company = job["company"]
    location = job.get("location", "N/A")
    job_type = job.get("type", "N/A")
    skills = ", ".join(job["skills"]) if job["skills"] else "N/A"

    qa_pairs = [
        {
            "question": f"What are the required skills for a {title} position at {company}?",
            "answer": f"The required skills for a {title} position at {company} are: {skills}."
        },
        {
            "question": f"Where is the {title} position at {company} located?",
            "answer": f"The {title} position at {company} is located in {location}."
        },
        {
            "question": f"What type of job is the {title} position at {company}?",
            "answer": f"The {title} position at {company} is a {job_type} role."
        },
        {
            "question": f"Is the {title} position at {company} remote?",
            "answer": f"{'Yes' if 'remote' in location.lower() else 'No'}, the job is based in {location}."
        },
        {
            "question": f"Does {company} offer remote work for {title} positions?",
            "answer": f"{'Yes' if 'remote' in location.lower() else 'No'}, {company} offers this role in {location}."
        },
        {
            "question": f"What does a {title} at {company} do?",
            "answer": f"A {title} at {company} is responsible for tasks requiring expertise in {skills}."
        },
        {
            "question": f"How can I apply for the {title} position at {company}?",
            "answer": f"You can apply for the {title} position at {company} by checking their careers page or contacting their HR department."
        }
    ]
    
    return qa_pairs

# Generate full dataset
qa_data = []
for job in jobs:
    qa_data.extend(generate_qa(job))

# Save as a training dataset
with open("job_qa.json", "w") as f:
    json.dump(qa_data, f, indent=4)

print(f"Data preprocessing completed! {len(qa_data)} QA pairs generated.")
