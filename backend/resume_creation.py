from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel
import os
import spacy
from fpdf import FPDF
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Load NLP model
nlp = spacy.load("en_core_web_sm")

app = FastAPI()

class ResumeRequest(BaseModel):
    name: str
    email: str
    skills: list[str]
    description: str

def generate_resume_text(data: ResumeRequest):
    doc = nlp(data.description)
    resume_text = f"""
    Name: {data.name}\n
    Email: {data.email}\n
    Skills: {', '.join(data.skills)}\n
    Summary: {doc.text}\n
    """
    return resume_text

def create_pdf(resume_text, file_path):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, resume_text)
    pdf.output(file_path)

@app.post("/generate-resume")
async def generate_resume(data: ResumeRequest):
    try:
        file_path = "resume.pdf"  # Save PDF in the current directory

        # Generate resume text and create PDF
        resume_text = generate_resume_text(data)
        create_pdf(resume_text, file_path)

        # Read the generated PDF file
        with open(file_path, "rb") as pdf_file:
            pdf_data = pdf_file.read()

        # Return the PDF file in the response
        return Response(content=pdf_data, media_type="application/pdf", headers={
            "Content-Disposition": "attachment; filename=resume.pdf"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
