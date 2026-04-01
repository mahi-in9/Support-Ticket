require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const ticketRoutes = require("./routes/ticket.routes");
const authRoutes = require("./routes/user.routes");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongoose connected"))
  .catch((error) => console.log(error.message));

app.use("/api/tickets", ticketRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Api is running on port: ${PORT}`);
});
