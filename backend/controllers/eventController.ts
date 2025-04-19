// controllers/eventController.ts
import { Request, Response } from "express";
import { Event } from "../models/Event";
import path from "path";
import fs from "fs";
import multer from "multer";
import { extractTextFromPDF } from "../utils/pdfExtractor";

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
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, organizer, details, time, whatsappNumber } = req.body;

    // Generate WhatsApp message link
    const message = `Hey! I saw your event "${name}" happening at ${time}. I'd love to know more!`;
    const encodedMessage = encodeURIComponent(message);
    const link = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Create event object
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
  } catch (err) {
    console.error("Event creation failed:", err);
    res.status(500).json({ error: "Event creation failed" });
  }
};

// Upload PDF and extract text
export const uploadEventPDF = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const { eventId } = req.params;
    const pdfPath = req.file.path;

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(pdfPath);

    // Update event with PDF context
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
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({
      success: true,
      message: "PDF uploaded and processed successfully",
      event,
    });
  } catch (err) {
    console.error("PDF upload failed:", err);
    // Clean up the file if there's an error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "PDF upload failed" });
  }
};

// Create event with PDF upload in one step
export const createEventWithPDF = async (req: Request, res: Response) => {
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

    // Create event object
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
  } catch (err) {
    console.error("Event creation with PDF failed:", err);
    // Clean up the file if there's an error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Event creation with PDF failed" });
  }
};
