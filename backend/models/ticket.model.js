const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "RESOLVED"],
      default: "OPEN",
    },
    category: {
      type: String,
      enum: ["PAYMENT", "LOGIN", "BUG", "OTHER"],
      default: "OTHER",
    },
    aiReply: {
      type: String,
      default: "",
    },
    suggestedReplies: [{
      type: String,
    }],
    confidence: {
      type: Number,
      default: 0,
    },
    isAIProcessed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);