const express = require("express");
const Message = require("../models/Message");
const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();
    res.json({ message: "Message sent" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Get messages received by a user
router.get("/received/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Find all messages where the receiver is the given user
      const messages = await Message.find({ receiver: userId }).populate("sender", "username");
  
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

module.exports = router;