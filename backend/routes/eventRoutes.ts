// routes/eventRoutes.ts
import express from "express";
import { createEvent, getAllEvents, getEventById } from "../controllers/eventController";

const router = express.Router();

// Get all events
router.get("/", getAllEvents);

// Get event by ID
router.get("/:eventId", getEventById);

// Create a new event
router.post("/create", createEvent);

export default router;
