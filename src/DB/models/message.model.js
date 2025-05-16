const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  senderId: {
    //HR or company owner
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default messageSchema;
