// routes/eventRoutes.ts
import express from "express";
import { createEvent, getAllEvents, getEventById } from "../controllers/eventController";

const router = express.Router();

// Get all events
router.get("/", getAllEvents);

// Get event by ID
router.get("/:eventId", getEventById);

// Test endpoint
router.post("/test", (req, res) => {
  console.log('Test endpoint called');
  console.log('Request body:', JSON.stringify(req.body));
  res.status(200).json({ success: true, message: 'Test endpoint working', body: req.body });
});

// Create a new event
router.post("/create", createEvent);

export default router;
