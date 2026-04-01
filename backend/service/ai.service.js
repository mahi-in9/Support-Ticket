const Ticket = require("../models/ticket.model");
const Message = require("../models/message.model");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Normalize category
const normalizeCategory = (category) => {
  const valid = ["PAYMENT", "LOGIN", "BUG", "OTHER"];
  if (!category) return "OTHER";

  const upper = category.toUpperCase();
  return valid.includes(upper) ? upper : "OTHER";
};

// Extract JSON safely
const extractJSON = (text) => {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) return null;

    const jsonString = text.substring(start, end + 1);

    return JSON.parse(jsonString);
  } catch {
    return null;
  }
};

// Fallback
const fallback = {
  category: "OTHER",
  replies: [
    "We are reviewing your issue and will get back to you shortly.",
    "Thank you for contacting us. Our team is looking into this.",
    "We apologize for the inconvenience. Please allow us to investigate.",
  ],
  confidence: 0.5,
};

async function processWithAI(ticketId) {
  try {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) throw new Error("Ticket not found");

    const prompt = `
You are a support assistant.

Strictly return ONLY valid JSON.

Rules:
- No explanation
- No markdown
- Category must be one of: PAYMENT, LOGIN, BUG, OTHER
- Return exactly 3-4 short professional replies (1-2 lines each)
- Each reply should be different but professional

Format:
{
  "category": "PAYMENT",
  "replies": [
    "First short professional reply",
    "Second short professional reply",
    "Third short professional reply",
    "Fourth short professional reply"
  ],
  "confidence": 0.0
}

User Issue:
"${ticket.description}"
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // ✅ Always use .text (stable API)
    const rawText = response.text;

    if (!rawText) throw new Error("Empty AI response");

    const parsed = extractJSON(rawText);

    let finalData;
    let aiMessage;

    if (parsed && parsed.replies && Array.isArray(parsed.replies)) {
      // Ensure we have 3-4 replies
      const validReplies = parsed.replies.slice(0, 4);
      while (validReplies.length < 3) {
        validReplies.push("Our team will respond to your issue shortly.");
      }

      finalData = {
        category: normalizeCategory(parsed.category),
        suggestedReplies: validReplies,
        aiReply: validReplies[0], // Default to first suggested reply
        confidence:
          typeof parsed.confidence === "number" ? parsed.confidence : 0.7,
        isAIProcessed: true,
      };

      aiMessage = validReplies[0];
    } else {
      finalData = {
        category: "OTHER",
        suggestedReplies: fallback.replies,
        aiReply: fallback.replies[0],
        confidence: fallback.confidence,
        isAIProcessed: true,
      };

      aiMessage = fallback.replies[0];
    }

    // Update ticket with AI data
    await Ticket.findByIdAndUpdate(ticketId, finalData);

    // Create AI message in the thread
    await Message.create({
      ticketId: ticketId,
      sender: "AI",
      message: aiMessage,
    });

  } catch (error) {
    console.error("AI processing failed:", error.message);

    // Update with fallback
    await Ticket.findByIdAndUpdate(ticketId, {
      category: "OTHER",
      suggestedReplies: fallback.replies,
      aiReply: fallback.replies[0],
      confidence: fallback.confidence,
      isAIProcessed: true,
    });

    // Create fallback AI message
    await Message.create({
      ticketId: ticketId,
      sender: "AI",
      message: fallback.replies[0],
    });
  }
}

module.exports = processWithAI;