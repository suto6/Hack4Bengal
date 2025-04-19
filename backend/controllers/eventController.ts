// controllers/eventController.ts
import { Request, Response } from "express";
import dotenv from "dotenv";
import prisma from "../services/prismaService";
import { Event } from "@prisma/client";

// Type for event data without ID and timestamps
type EventCreateInput = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;

// Load environment variables
dotenv.config();

// Removed multer configuration for PDF uploads

// Create a new event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Creating event with data received');
    const { name, organizer, details, time, whatsappNumber } = req.body;

    // Validate required fields
    if (!name || !organizer || !details || !time || !whatsappNumber) {
      console.error('Missing required fields:', { name, organizer, time, whatsappNumber });
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Generate a web chat link
    let chatLink = "/event/placeholder";

    // Create event using Prisma
    const eventData: EventCreateInput = {
      name,
      organizer,
      details: details.substring(0, 1000), // Limit details to 1000 chars to avoid DB issues
      time,
      contactNumber: whatsappNumber,
      chatLink,
      whatsappNumber,
      whatsappMessage: chatLink,
      context: details, // Use the full details as context for the chatbot
    };

    console.log('Event data prepared for saving');

    const event = await prisma.event.create({
      data: eventData,
    });

    console.log('Event created successfully with ID:', event.id);

    // Update the chat link with the actual event ID
    chatLink = `/event/${event.id}`;

    res.status(201).json({
      success: true,
      link: chatLink,
      event
    });
  } catch (err) {
    console.error("Event creation failed:", err);

    // Provide more specific error message
    let errorMessage = "Event creation failed";
    if (err instanceof Error) {
      errorMessage += ": " + err.message;
    }

    res.status(500).json({ error: errorMessage });
  }
};

// Removed PDF upload function

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

// Removed PDF upload function
