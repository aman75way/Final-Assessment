from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer
import json
import fitz 
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import traceback
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load and fine-tune the NLP model
def load_model():
    model_name = "t5-small"  # Change to a larger model if needed
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    return pipeline("text2text-generation", model=model, tokenizer=tokenizer)

nlp_pipeline = load_model()

# Load custom dataset for fine-tuning
def load_training_data():
    with open("./data.json", "r") as file:
        return json.load(file)

training_data = load_training_data()

class ResumeRequest(BaseModel):
    user_id: str
    name: str
    email: str
    skills: list[str]
    description: str


import traceback  # Import traceback to print error details

@app.post("/generate-resume")
def generate_resume(request: ResumeRequest):
    try:
        # Generate ATS-friendly description
        prompt = f"Generate an ATS-friendly professional summary for: {request.description}"
        generated_text = nlp_pipeline(prompt, max_length=200, truncation=True)[0]['generated_text']

        # Create PDF resume with proper formatting
        pdf_path = f"resume_{request.user_id}.pdf"
        doc = fitz.open()
        page = doc.new_page()

        # Define text properties
        font_size_heading = 14
        font_size_body = 12
        line_spacing = 20  # Adjust spacing between lines
        x_start = 50  # Left margin
        y_start = 50  # Top margin
        y_position = y_start

        # Helper function to add bold text
        def add_bold_text(page, text, x, y, size=font_size_heading):
            page.insert_text((x, y), text, fontsize=size, fontname="helv", color=(0, 0, 0), bold=True)

        # Helper function to add normal text
        def add_text(page, text, x, y, size=font_size_body):
            page.insert_text((x, y), text, fontsize=size, fontname="helv", color=(0, 0, 0))

        # Add Resume Content
        add_bold_text(page, "Resume", x_start, y_position, size=16)
        y_position += line_spacing * 2

        add_bold_text(page, "Name:", x_start, y_position)
        add_text(page, request.name, x_start + 100, y_position)
        y_position += line_spacing

        add_bold_text(page, "Email:", x_start, y_position)
        add_text(page, request.email, x_start + 100, y_position)
        y_position += line_spacing

        add_bold_text(page, "Skills:", x_start, y_position)
        add_text(page, ", ".join(request.skills), x_start + 100, y_position)
        y_position += line_spacing * 2

        add_bold_text(page, "Professional Summary:", x_start, y_position)
        y_position += line_spacing

        # Wrap text for better readability
        summary_text = generated_text
        words = summary_text.split()
        wrapped_text = ""
        line_length = 80  # Max characters per line

        while words:
            line = ""
            while words and len(line) + len(words[0]) + 1 <= line_length:
                line += " " + words.pop(0)
            wrapped_text += line.strip() + "\n"

        add_text(page, wrapped_text, x_start, y_position)
        y_position += (wrapped_text.count("\n") + 1) * line_spacing

        # Save and return PDF
        doc.save(pdf_path)
        doc.close()

        return FileResponse(pdf_path, media_type="application/pdf", filename=f"resume_{request.user_id}.pdf")

    except Exception as e:
        error_details = traceback.format_exc()  # Capture full error traceback
        print("Error in /generate-resume:", error_details)  # Print error in logs
        raise HTTPException(status_code=500, detail=str(e))  # Return error response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
