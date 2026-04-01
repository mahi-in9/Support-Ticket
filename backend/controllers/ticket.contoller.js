const Ticket = require("../models/ticket.model");
const processWithAI = require("../service/ai.service");

async function createTicket(req, res) {
  try {
    const { name, email, description } = req.body;

    if (!name || !email || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const ticket = await Ticket.create({
      name,
      email,
      description,
      userId: req.user.id,
      status: "OPEN",
      isAIProcessed: false,
    });

    // Async AI trigger (non-blocking)
    processWithAI(ticket._id);

    return res.status(201).json({
      success: true,
      ticketId: ticket._id,
      status: ticket.status,
      message: "Ticket created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
      error: error.message,
    });
  }
}

async function getAllTickets(req, res) {
  try {
    // Admin gets all tickets
    const tickets = await Ticket.find().sort({ createdAt: -1 });

    const response = tickets.map((t) => ({
      ticketId: t._id,
      description: t.description,
      category: t.category,
      status: t.status,
      createdAt: t.createdAt,
      isAIProcessed: t.isAIProcessed,
    }));

    return res.status(200).json({
      success: true,
      tickets: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
      error: error.message,
    });
  }
}

async function getTicketById(req, res) {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // User can only access own ticket
    if (userRole !== "ADMIN" && ticket.userId?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own tickets.",
      });
    }

    return res.status(200).json({
      success: true,
      ticket: {
        ticketId: ticket._id,
        name: ticket.name,
        email: ticket.email,
        description: ticket.description,
        category: ticket.category,
        aiReply: ticket.aiReply,
        suggestedReplies: ticket.suggestedReplies,
        confidence: ticket.confidence,
        status: ticket.status,
        isAIProcessed: ticket.isAIProcessed,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
      error: error.message,
    });
  }
}

async function updateTicketStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["OPEN", "RESOLVED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
      error: error.message,
    });
  }
}

async function updateAiReply(req, res) {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { aiReply: reply },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
      error: error.message,
    });
  }
}

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  updateAiReply,
};