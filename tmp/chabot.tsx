import { useState } from "react";
import axios from "axios";

const Chatbot = () => {
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");

    const handleChat = async () => {
        if (!question) return;
        try {
            const res = await axios.post("http://localhost:8000/chat", { question });
            setResponse(res.data.response);
        } catch (error) {
            console.error("Error:", error);
            setResponse("Error connecting to chatbot.");
        }
    };

    return (
        <div>
            <h2>Job Chatbot</h2>
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask me about job roles..."
            />
            <button onClick={handleChat}>Ask</button>
            <p><strong>Chatbot:</strong> {response}</p>
        </div>
    );
};

export default Chatbot;
