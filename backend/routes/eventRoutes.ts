// routes/eventRoutes.ts
import express from "express";
import { createEvent, uploadEventPDF, createEventWithPDF, getAllEvents, upload } from "../controllers/eventController";

const router = express.Router();

// Get all events
router.get("/", getAllEvents);

// Create a new event (without PDF)
router.post("/create", createEvent);

// Upload PDF for an existing event
router.post("/upload-pdf/:eventId", upload.single("pdf"), uploadEventPDF);

// Create a new event with PDF in one step
router.post("/create-with-pdf", upload.single("pdf"), createEventWithPDF);

export default router;
