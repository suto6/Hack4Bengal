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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
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
    console.log('Creating event with data:', req.body);
    const { name, organizer, details, time, whatsappNumber } = req.body;

    // Generate a web chat link
    let chatLink = "/event/placeholder";

    // Create event using Prisma
    const eventData: any = {
      name,
      organizer,
      details,
      time,
      contactNumber: whatsappNumber,
      chatLink,
      whatsappNumber,
      whatsappMessage: chatLink,
    };

    console.log('Event data to be saved:', eventData);

    const event = await prisma.event.create({
      data: eventData,
    });

    console.log('Event created successfully:', event);

    // Update the chat link with the actual event ID
    chatLink = `/event/${event.id}`;

    res.status(201).json({
      success: true,
      link: chatLink,
      event
    });
  } catch (err) {
    console.error("Event creation failed:", err);
    console.error("Error details:", JSON.stringify(err));
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
export const getAllEvents = async (_: Request, res: Response): Promise<void> => {
  try {
    const events = await prisma.event.findMany();
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// Get event by ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.status(200).json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

// Create event with PDF upload in one step
export const createEventWithPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, organizer, details, time, whatsappNumber } = req.body;

    // Generate a web chat link
    let chatLink = "/event/placeholder";

    let context = details;
    let pdfPath = "";

    // If PDF was uploaded, extract text
    if (req.file) {
      pdfPath = req.file.path;
      context = await extractTextFromPDF(pdfPath);
    }

    // Create event using Prisma
    const eventData: any = {
      name,
      organizer,
      details,
      time,
      contactNumber: whatsappNumber,
      chatLink,
      whatsappNumber,
      whatsappMessage: chatLink,
      context,
      pdfPath,
    };

    const event = await prisma.event.create({
      data: eventData,
    });

    // Update the chat link with the actual event ID
    chatLink = `/event/${event.id}`;

    res.status(201).json({
      success: true,
      link: chatLink,
      event
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
