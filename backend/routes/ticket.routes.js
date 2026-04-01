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

// USER ROUTES
// POST /tickets - Create a ticket (Authenticated users)
router.post("/", createTicket);

// GET /tickets/my - Get user's own tickets
router.get("/my", getMyTickets);

// ADMIN ROUTES
// GET /tickets - Get all tickets (ADMIN only)
router.get("/", isAdmin, getAllTickets);

// SHARED ROUTES
// GET /tickets/:id - Get ticket by ID (Owner or Admin)
router.get("/:id", getTicketById);

// GET /tickets/:id/messages - Get ticket messages (Owner or Admin)
router.get("/:id/messages", getTicketMessages);

// POST /tickets/:id/reply - Send reply (Owner or Admin)
router.post("/:id/reply", sendReply);

// ADMIN ONLY ROUTES
// POST /tickets/:id/status - Update ticket status (ADMIN only)
router.post("/:id/status", isAdmin, updateTicketStatus);

// POST /tickets/:id/reply (legacy - for admin direct edit)
router.post("/:id/aireply", isAdmin, updateAiReply);

module.exports = router;