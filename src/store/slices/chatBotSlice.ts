import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChatResponse = createAsyncThunk(
  "chatbot/fetchResponse",
  async (message: string) => {
    const response = await axios.post("http://localhost:8000/chatbot/", { user_input: message });
    return response.data.response;
  }
);

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState: { chat: [] as ChatMessage[] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchChatResponse.fulfilled, (state, action) => {
      state.chat.push({ message: action.payload, isBot: true });
    });
  },
});

export default chatbotSlice.reducer;
