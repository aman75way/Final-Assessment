import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatResponse } from "../store/slices/chatBotSlice";
import { RootState } from "../store/store";
import { AppDispatch } from "../store/store";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const chat = useSelector((state: RootState) => state.chatbot.chat);

  const handleSend = () => {
    dispatch(fetchChatResponse(input));
    setInput("");
  };

  return (
    <div>
      <div>
        {chat.map((msg: ChatMessage, i: number) => (
          <p key={i}>{msg.isBot ? "Bot: " : "You: "}{msg.message}</p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chatbot;
