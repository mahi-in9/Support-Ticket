const Ticket = require("../models/ticket.model");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

async function processWithAI(ticketId) {
  try {
    const ticket = await Ticket.findById(ticketId);

    const prompt = `You are a support assistant.
This is the given description: ${ticket.description}

Classify into: PAYMENT, LOGIN, BUG, OTHER
Generate a short professional reply.

Respond ONLY in JSON:
{
  "category": "...",
  "reply": "...",
  "confidence": 0.0-1.0
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("No AI response");

    // ✅ Remove markdown
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleanedText);
    } catch (err) {
      console.error("Invalid JSON from AI:", cleanedText);

      parsed = {
        category: "OTHER",
        reply: "We are reviewing your issue.",
        confidence: 0,
      };
    }

    await Ticket.findByIdAndUpdate(ticketId, {
      category: parsed.category || "OTHER",
      aiReply: parsed.reply || "",
      confidence: parsed.confidence || 0,
      isAIProcessed: true,
    });
  } catch (error) {
    console.error("AI failed:", error.message);
  }
}

module.exports = processWithAI;
