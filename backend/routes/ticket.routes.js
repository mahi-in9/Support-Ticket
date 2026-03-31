const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  updateAiReply,
} = require("../controllers/ticket.contoller");

const express = require("express");

const router = express.Router();

router.post("/", createTicket);
router.get("/", getAllTickets);
router.post("/:id/status", updateTicketStatus);
router.post("/:id/reply", updateAiReply);
router.get("/:id", getTicketById);

module.exports = router;
