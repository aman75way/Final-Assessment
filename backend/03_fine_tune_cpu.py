import torch
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer
from peft import LoraConfig, get_peft_model

# Load dataset
dataset = load_dataset("json", data_files="job_qa.json")

# Load tokenizer and model
MODEL_NAME = "HuggingFaceH4/zephyr-7b-alpha"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

# Load model on CPU
device = torch.device("cpu")
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME).to(device)

# Apply LoRA
lora_config = LoraConfig(
    r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"], lora_dropout=0.05
)
model = get_peft_model(model, lora_config)

# Tokenize data
def tokenize_function(examples):
    return tokenizer(examples["question"], examples["answer"], truncation=True, padding="max_length")

tokenized_datasets = dataset.map(tokenize_function, batched=True)

# Training arguments
training_args = TrainingArguments(
    output_dir="./fine_tuned_model",
    per_device_train_batch_size=1,  # Reduce batch size for CPU
    per_device_eval_batch_size=1,
    num_train_epochs=3,
    logging_dir="./logs",
    save_strategy="epoch",
    save_total_limit=1
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets["train"],
)

# Training loop
trainer.train()

# Save fine-tuned model
model.save_pretrained("./fine_tuned_model")
tokenizer.save_pretrained("./fine_tuned_model")
print("Fine-tuning completed!")
