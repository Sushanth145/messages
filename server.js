require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

// Initialize Express & Server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/messages", require("./routes/messages"));

// Socket.io Connection
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data); // Send message to all users
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
