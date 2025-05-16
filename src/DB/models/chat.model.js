import mongoose from "mongoose";
import messageSchema from "./message.model.js";

const chatSchema = new mongoose.Schema({
  senderId: {
    //HR or company owner
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recievedId: {
    //any user
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [messageSchema],
});

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;
