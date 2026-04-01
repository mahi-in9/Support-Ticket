const {
  createTicket,
  getMyTickets,
  getAllTickets,
  getTicketById,
  getTicketMessages,
  sendReply,
  updateTicketStatus,
  updateAiReply,
} = require("../controllers/ticket.contoller");
const authMiddleware = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/admin.middleware");
const express = require("express");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// ===== SPECIFIC ROUTES FIRST =====

// POST /tickets - Create a ticket
router.post("/", createTicket);

// GET /tickets/my - Get user's own tickets (must be before /:id)
router.get("/my", getMyTickets);

// GET /tickets - Get all tickets (ADMIN only)
router.get("/", isAdmin, getAllTickets);

// ===== PARAMETERIZED ROUTES AFTER =====

// GET /tickets/:id - Get ticket by ID
router.get("/:id", getTicketById);

// GET /tickets/:id/messages - Get messages (must be before /:id/reply)
router.get("/:id/messages", getTicketMessages);

// POST /tickets/:id/reply - Send reply
router.post("/:id/reply", sendReply);

// POST /tickets/:id/status - Update status (ADMIN only)
router.post("/:id/status", isAdmin, updateTicketStatus);

// POST /tickets/:id/aireply - Admin AI reply edit (ADMIN only)
router.post("/:id/aireply", isAdmin, updateAiReply);

module.exports = router;