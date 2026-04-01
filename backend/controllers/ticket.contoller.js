const Ticket = require("../models/ticket.model");
const Message = require("../models/message.model");
const processWithAI = require("../service/ai.service");

// @desc Create a new ticket (USER)
// @route POST /api/tickets
// @access Private (Authenticated)
async function createTicket(req, res) {
  try {
    const { name, email, description } = req.body;

    if (!name || !email || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create ticket with userId
    const ticket = await Ticket.create({
      userId: req.user.id,
      name,
      email,
      description,
      status: "OPEN",
      isAIProcessed: false,
    });

    // Create first message with the description
    await Message.create({
      ticketId: ticket._id,
      sender: "USER",
      message: description,
    });

    // Trigger AI processing asynchronously
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
      message: "Server error",
      error: error.message,
    });
  }
}

// @desc Get user's own tickets
// @route GET /api/tickets/my
// @access Private (USER)
async function getMyTickets(req, res) {
  try {
    const tickets = await Ticket.find({ userId: req.user.id }).sort({ createdAt: -1 });

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
      message: "Server error",
      error: error.message,
    });
  }
}

// @desc Get all tickets (ADMIN only)
// @route GET /api/tickets
// @access Private (ADMIN)
async function getAllTickets(req, res) {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });

    const response = tickets.map((t) => ({
      ticketId: t._id,
      userId: t.userId,
      name: t.name,
      email: t.email,
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
      message: "Server error",
      error: error.message,
    });
  }
}

// @desc Get ticket by ID
// @route GET /api/tickets/:id
// @access Private (Owner or ADMIN)
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
        userId: ticket.userId,
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
        updatedAt: ticket.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

// @desc Get ticket messages (thread)
// @route GET /api/tickets/:id/messages
// @access Private (Owner or ADMIN)
async function getTicketMessages(req, res) {
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

    const messages = await Message.find({ ticketId: id }).sort({ createdAt: 1 });

    const response = messages.map((m) => ({
      sender: m.sender,
      message: m.message,
      createdAt: m.createdAt,
    }));

    return res.status(200).json({
      success: true,
      messages: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

// @desc Send a reply (create message)
// @route POST /api/tickets/:id/reply
// @access Private (USER or ADMIN)
async function sendReply(req, res) {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const userRole = req.user.role;

    if (!reply) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // User can only reply to own ticket
    if (userRole !== "ADMIN" && ticket.userId?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only reply to your own tickets.",
      });
    }

    // Determine sender type
    const sender = userRole === "ADMIN" ? "ADMIN" : "USER";

    // Create message
    const message = await Message.create({
      ticketId: id,
      sender,
      message: reply,
    });

    // Update ticket's aiReply if it's an admin reply
    if (sender === "ADMIN") {
      await Ticket.findByIdAndUpdate(id, { aiReply: reply });
    }

    return res.status(201).json({
      success: true,
      message: "Reply sent successfully",
      data: {
        sender: message.sender,
        message: message.message,
        createdAt: message.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

// @desc Update ticket status (ADMIN only)
// @route POST /api/tickets/:id/status
// @access Private (ADMIN)
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
        message: "Ticket not found",
      });
    }

    // Create status change message
    await Message.create({
      ticketId: id,
      sender: "ADMIN",
      message: `Ticket status changed to ${status}`,
    });

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

// @desc Update AI reply (ADMIN only)
// @route POST /api/tickets/:id/reply
// @access Private (ADMIN) - Legacy, now handled by sendReply
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
        message: "Ticket not found",
      });
    }

    // Create message for admin reply
    await Message.create({
      ticketId: id,
      sender: "ADMIN",
      message: reply,
    });

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = {
  createTicket,
  getMyTickets,
  getAllTickets,
  getTicketById,
  getTicketMessages,
  sendReply,
  updateTicketStatus,
  updateAiReply,
};