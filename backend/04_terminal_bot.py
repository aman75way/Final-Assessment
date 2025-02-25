from transformers import AutoModelForCausalLM, AutoTokenizer

# Load fine-tuned model
MODEL_PATH = "./fine_tuned_model"
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForCausalLM.from_pretrained(MODEL_PATH)

def chatbot():
    print("Job Chatbot is running! Type 'exit' to quit.")
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "exit":
            break

        # Tokenize input
        input_ids = tokenizer.encode(user_input, return_tensors="pt")

        # Generate response
        output = model.generate(input_ids, max_length=150)
        response = tokenizer.decode(output[0], skip_special_tokens=True)

        print(f"Chatbot: {response}")

chatbot()
