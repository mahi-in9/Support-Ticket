require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const ticketRoutes = require("./routes/ticket.routes");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
  }),
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongoose connected"))
  .catch((error) => console.log(error.message));

app.use("/api/tickets", ticketRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Api is running on port: ${PORT}`);
});

// My ticket is not loading in main page. please fix this issue as soon as possible
