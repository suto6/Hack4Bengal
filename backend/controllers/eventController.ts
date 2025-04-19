// controllers/eventController.ts
import { Request, Response } from "express";
import { Event } from "../models/Event";
import path from "path";
import fs from "fs";
import multer from "multer";
import { extractTextFromPDF } from "../utils/pdfExtractor";
import * as inMemoryStore from "../utils/inMemoryStore";

// Flag to determine if we're using MongoDB or in-memory store
const useMongoDb = process.env.MONGO_URI ? true : false;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
      cb(null, false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// Create a new event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, organizer, details, time, whatsappNumber } = req.body;

    // Generate WhatsApp message link
    const message = `Hey! I saw your event "${name}" happening at ${time}. I'd love to know more!`;
    const encodedMessage = encodeURIComponent(message);
    const link = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    if (useMongoDb) {
      // Create event object in MongoDB
      const event = new Event({
        name,
        organizer,
        details,
        time,
        whatsappNumber,
        whatsappMessage: link,
      });

      await event.save();
      res.status(201).json({ success: true, link });
    } else {
      // Use in-memory store
      const event = inMemoryStore.createEvent({
        name,
        organizer,
        details,
        time,
        whatsappNumber,
        whatsappMessage: link,
      });

      res.status(201).json({ success: true, link, event });
    }
  } catch (err) {
    console.error("Event creation failed:", err);
    res.status(500).json({ error: "Event creation failed" });
  }
};

// Upload PDF and extract text
export const uploadEventPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No PDF file uploaded" });
      return;
    }

    const { eventId } = req.params;
    const pdfPath = req.file.path;

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(pdfPath);

    if (useMongoDb) {
      // Update event with PDF context in MongoDB
      const event = await Event.findByIdAndUpdate(
        eventId,
        {
          context: extractedText,
          pdfPath: pdfPath,
        },
        { new: true }
      );

      if (!event) {
        // Clean up the file if event not found
        fs.unlinkSync(pdfPath);
        res.status(404).json({ error: "Event not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "PDF uploaded and processed successfully",
        event,
      });
    } else {
      // Use in-memory store
      const event = inMemoryStore.updateEvent(eventId, {
        context: extractedText,
        pdfPath: pdfPath,
      });

      if (!event) {
        // Clean up the file if event not found
        fs.unlinkSync(pdfPath);
        res.status(404).json({ error: "Event not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "PDF uploaded and processed successfully",
        event,
      });
    }
  } catch (err) {
    console.error("PDF upload failed:", err);
    // Clean up the file if there's an error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "PDF upload failed" });
  }
};

// Get all events
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useMongoDb) {
      const events = await Event.find();
      res.status(200).json(events);
    } else {
      // Use in-memory store
      const events = inMemoryStore.getAllEvents();
      res.status(200).json(events);
    }
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// Create event with PDF upload in one step
export const createEventWithPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, organizer, details, time, whatsappNumber } = req.body;

    // Generate WhatsApp message link
    const message = `Hey! I saw your event "${name}" happening at ${time}. I'd love to know more!`;
    const encodedMessage = encodeURIComponent(message);
    const link = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    let context = details;
    let pdfPath = "";

    // If PDF was uploaded, extract text
    if (req.file) {
      pdfPath = req.file.path;
      context = await extractTextFromPDF(pdfPath);
    }

    if (useMongoDb) {
      // Create event object in MongoDB
      const event = new Event({
        name,
        organizer,
        details,
        time,
        whatsappNumber,
        whatsappMessage: link,
        context,
        pdfPath,
      });

      await event.save();

      res.status(201).json({
        success: true,
        link,
        event,
      });
    } else {
      // Use in-memory store
      const event = inMemoryStore.createEvent({
        name,
        organizer,
        details,
        time,
        whatsappNumber,
        whatsappMessage: link,
        context,
        pdfPath,
      });

      res.status(201).json({
        success: true,
        link,
        event,
      });
    }
  } catch (err) {
    console.error("Event creation with PDF failed:", err);
    // Clean up the file if there's an error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Event creation with PDF failed" });
  }
};
