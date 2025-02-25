import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    const res = await axios.post("http://localhost:8000/chatbot/", { query: message });
    setResponse(res.data.response);
  };

  return (
    <Box sx={{ width: "100%", p: 2, textAlign: "center" }}>
      <Typography variant="h5">Job Chatbot</Typography>
      <TextField
        fullWidth
        label="Ask me about jobs!"
        variant="outlined"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={handleSend} sx={{ mt: 2, backgroundColor: "black", color: "white" }}>
        Send
      </Button>
      <Typography sx={{ mt: 2, color: "black" }}>{response}</Typography>
    </Box>
  );
};

export default Chatbot;
