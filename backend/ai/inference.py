from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

MODEL_PATH = "./fine_tuned_model"
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForCausalLM.from_pretrained(MODEL_PATH)
chatbot = pipeline("text-generation", model=model, tokenizer=tokenizer)

def generate_response(prompt):
    return chatbot(prompt, max_length=150)[0]["generated_text"]
