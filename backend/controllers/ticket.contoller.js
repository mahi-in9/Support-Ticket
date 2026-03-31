const Ticket = require("../models/ticket.model");

const processWithAI = require("../service/ai.service");

async function createTicket(req, res) {
  try {
    const { name, email, description } = req.body;
    if ((!name || !email, !description)) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const ticket = await Ticket.create({
      name,
      email,
      description,
    });

    await processWithAI(ticket._id);
    return res
      .status(201)
      .json({ ticketId: ticket._id, status: ticket.status });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "server error", error: error.message });
  }
}

async function getAllTickets(req, res) {
  try {
    const tickets = await Ticket.find();
    if (!tickets)
      return res
        .status(400)
        .json({ success: false, message: "no tickets found" });

    const response = tickets.map((t) => ({
      ticketId: `tkt_${t._id}`,
      description: t.description,
      category: t.category,
      status: t.status,
      createdAt: t.createdAt,
    }));
    return res.status(200).json({ success: true, response });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "server error", error: error.message });
  }
}

async function getTicketById(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Ticket ID is required",
      });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket)
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    return res.status(200).json({
      success: true,
      ticketId: `tkt_${ticket._id}`,
      name: ticket.name,
      email: ticket.email,
      description: ticket.description,
      category: ticket.category,
      aiReply: ticket.aiReply,
      status: ticket.status,
      createdAt: ticket.createdAt,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "server error", error: error.message });
  }
}

async function updateTicketStatus(req, res) {
  try {
    const { id } = req.query;
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!ticket)
      return res
        .status(404)
        .json({ success: false, message: "ticket not found" });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "server error", error: error.message });
  }
}

async function updateAiReply(req, res) {
  try {
    const { id } = req.query;
    const { reply } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { aiReply: reply },
      { new: true },
    );
    if (!ticket)
      return res
        .status(400)
        .json({ success: false, message: "ticket not found" });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "server error", error: error.message });
  }
}

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  updateAiReply,
};
