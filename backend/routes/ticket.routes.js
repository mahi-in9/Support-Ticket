const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  updateAiReply,
} = require("../controllers/ticket.contoller");
const authMiddleware = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/admin.middleware");
const express = require("express");

const router = express.Router();

// GET /tickets - Get all tickets (ADMIN only)
router.get("/", authMiddleware, isAdmin, getAllTickets);

// POST /tickets - Create a ticket (Authenticated users)
router.post("/", authMiddleware, createTicket);

// GET /tickets/:id - Get ticket by ID (User can only access own ticket, Admin can access all)
router.get("/:id", authMiddleware, getTicketById);

// POST /tickets/:id/status - Update ticket status (ADMIN only)
router.post("/:id/status", authMiddleware, isAdmin, updateTicketStatus);

// POST /tickets/:id/reply - Update AI reply (ADMIN only)
router.post("/:id/reply", authMiddleware, isAdmin, updateAiReply);

module.exports = router;