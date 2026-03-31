const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["OPEN", "PENDING", "RESOLVED"],
      default: "OPEN",
    },
    category: {
      type: String,
      enum: ["PAYMENT", "LOGIN", "BUG", "OTHER"],
      default: "OTHER",
    },
    aiReply: String,
    confidence: Number,
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
    isAIProcessed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Ticket", ticketSchema);
