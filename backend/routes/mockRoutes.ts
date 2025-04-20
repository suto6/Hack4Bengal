// routes/mockRoutes.ts
import express from "express";

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log('Mock route accessed:', req.method, req.path, req.body);
  next();
});

// Handle mock chat messages
router.post("/chat", (req, res) => {
  try {
    const { eventId, message } = req.body;
    console.log('Mock chat endpoint called with:', { eventId, message });
    
    if (!eventId || !message) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }
    
    // For team size question, return a direct answer
    if (message.toLowerCase().includes('team') && 
        (message.toLowerCase().includes('size') || message.toLowerCase().includes('members'))) {
      res.status(200).json({
        response: "Teams for the hackathon can have 2-4 members. This is mentioned in the event details. Each team should register together and will work on a single project during the 36-hour hackathon period."
      });
      return;
    }
    
    // For other questions, provide a generic response
    res.status(200).json({
      response: "This is a 36-hour hackathon where developers, designers, and innovators come together to build amazing projects. The event will be held on June 15, 2023, starting at 10:00 AM. There will be prizes worth ₹50,000 for the winners."
    });
  } catch (error) {
    console.error('Error in mock chat endpoint:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
