// controllers/eventController.ts
import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import dotenv from "dotenv";
import { extractTextFromPDF } from "../utils/pdfExtractor";
import prisma from "../services/prismaService";

// Load environment variables
dotenv.config();

// Get Twilio phone number from environment variables
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

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

    // Generate WhatsApp message link using Twilio bot number
    // Include the event name in the message so the bot can identify which event to respond about
    const message = `Hi, I'm interested in the event: ${name}`;
    const encodedMessage = encodeURIComponent(message);
    // Use the Twilio phone number from .env
    const twilioNumber = TWILIO_PHONE_NUMBER.replace(/\D/g, '').replace('whatsapp:', '');
    const link = `https://wa.me/${twilioNumber}?text=${encodedMessage}`;

    // Create event using Prisma
    const event = await prisma.event.create({
      data: {
        name,
        organizer,
        details,
        time,
        whatsappNumber,
        whatsappMessage: link,
      },
    });

    res.status(201).json({ success: true, link, event });
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

    // Update event with PDF context using Prisma
    try {
      const event = await prisma.event.update({
        where: { id: eventId },
        data: {
          context: extractedText,
          pdfPath: pdfPath,
        },
      });

      res.status(200).json({
        success: true,
        message: "PDF uploaded and processed successfully",
        event,
      });
    } catch (error) {
      // Clean up the file if event not found
      fs.unlinkSync(pdfPath);
      res.status(404).json({ error: "Event not found" });
      return;
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
    const events = await prisma.event.findMany();
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// Create event with PDF upload in one step
export const createEventWithPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, organizer, details, time, whatsappNumber } = req.body;

    // Generate WhatsApp message link using Twilio bot number
    // Include the event name in the message so the bot can identify which event to respond about
    const message = `Hi, I'm interested in the event: ${name}`;
    const encodedMessage = encodeURIComponent(message);
    // Use the Twilio phone number from .env
    const twilioNumber = TWILIO_PHONE_NUMBER.replace(/\D/g, '').replace('whatsapp:', '');
    const link = `https://wa.me/${twilioNumber}?text=${encodedMessage}`;

    let context = details;
    let pdfPath = "";

    // If PDF was uploaded, extract text
    if (req.file) {
      pdfPath = req.file.path;
      context = await extractTextFromPDF(pdfPath);
    }

    // Create event using Prisma
    const event = await prisma.event.create({
      data: {
        name,
        organizer,
        details,
        time,
        whatsappNumber,
        whatsappMessage: link,
        context,
        pdfPath,
      },
    });

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
