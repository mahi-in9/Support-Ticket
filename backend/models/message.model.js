const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    sender: {
      type: String,
      enum: ["USER", "ADMIN", "AI"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);