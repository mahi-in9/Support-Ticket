require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const ticketRoutes = require("./routes/ticket.routes");

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongoose connected"))
  .catch((error) => console.log(error.message));

app.use("/api/tickets", ticketRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Api is running on port: ${PORT}`);
});
