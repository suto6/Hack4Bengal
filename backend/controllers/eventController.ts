// controllers/eventController.ts
import { Request, Response } from "express";
import dotenv from "dotenv";
import { createMockEvent, isMockEventId } from "../services/mockEventService";
import * as jsonStorage from "../services/jsonStorageService";
import { Event, EventCreateInput } from "../services/jsonStorageService";

/**
 * Format event details into a structured context for the LLM
 * @param name Event name
 * @param organizer Organizer name
 * @param time Event time
 * @param contactNumber Contact number
 * @param details Full event details
 * @returns Formatted context string
 */
const formatEventContext = (name: string, organizer: string, time: string, contactNumber: string, details: string): string => {
  // This function is kept for backward compatibility
  return formatEventContextWithFaqs(name, organizer, time, contactNumber, details, null);
};

/**
 * Format event details with FAQs into a structured context for the LLM
 * @param name Event name
 * @param organizer Organizer name
 * @param time Event time
 * @param contactNumber Contact number
 * @param details Full event details
 * @param faqs Array of FAQ objects with question and answer properties
 * @returns Formatted context string
 */
const formatEventContextWithFaqs = (name: string, organizer: string, time: string, contactNumber: string, details: string, faqs: any[] | null): string => {
  // Extract sections from details if they exist
  const sections: Record<string, string> = {
    'Venue Address': '',
    'Parking Information': '',
    'Accommodation Information': '',
    'Food & Refreshments': '',
    'Certificates & Rewards': '',
    'Registration Information': '',
    'FAQs': ''
  };

  // Parse the details to extract structured sections
  const detailsLines = details.split('\n');
  let currentSection = '';
  let mainDetails = [];

  for (const line of detailsLines) {
    // Check if this line is a section header
    let foundSection = false;
    for (const sectionName of Object.keys(sections)) {
      if (line.includes(sectionName + ':')) {
        currentSection = sectionName;
        foundSection = true;
        break;
      }
    }

    if (foundSection) {
      continue; // Skip the section header line
    }

    // Add line to the appropriate section or main details
    if (currentSection && sections[currentSection] !== undefined) {
      sections[currentSection] += (sections[currentSection] ? '\n' : '') + line;
    } else {
      mainDetails.push(line);
    }
  }

  // Build the structured context
  let context = `Event Information:\n\nName: ${name}\nOrganizer: ${organizer}\nTime: ${time}\nContact: ${contactNumber}`;

  // Add main details
  if (mainDetails.length > 0) {
    context += `\n\nEvent Details:\n${mainDetails.join('\n')}`;
  }

  // Add each section that has content
  for (const [sectionName, content] of Object.entries(sections)) {
    if (content.trim()) {
      context += `\n\n${sectionName}:\n${content.trim()}`;
    }
  }

  // Add FAQs if provided
  if (faqs && Array.isArray(faqs) && faqs.length > 0) {
    context += '\n\nFrequently Asked Questions:\n';

    faqs.forEach((faq, index) => {
      if (faq.question && faq.answer) {
        context += `\nQ: ${faq.question}\nA: ${faq.answer}\n`;
      }
    });
  }

  return context;
};

// Load environment variables
dotenv.config();

// Removed multer configuration for PDF uploads

// Create a new event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Creating event with data received');
    console.log('Request body:', JSON.stringify(req.body));

    const {
      name,
      organizer,
      details,
      startTime,
      endTime,
      date,
      faqs,
      contactNumber
    } = req.body;

    // Validate required fields
    if (!name || !organizer || !details) {
      console.error('Missing required fields:', {
        name: name || 'missing',
        organizer: organizer || 'missing',
        details: details ? 'present' : 'missing'
      });
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    console.log('Extracted fields:', {
      name,
      organizer,
      details: details ? details.substring(0, 50) + '...' : undefined,
      startTime,
      endTime,
      date,
      faqs: faqs ? 'Present' : 'Not present',
      contactNumber
    });

    // Format time string from the new fields
    let timeString = '';
    if (date) {
      timeString = date;
      if (startTime) {
        timeString += ` at ${startTime}`;
        if (endTime) {
          timeString += ` to ${endTime}`;
        }
      }
    } else {
      timeString = 'Date to be announced';
    }

    // Process FAQs if provided
    let faqsString = null;
    if (faqs && Array.isArray(faqs) && faqs.length > 0) {
      faqsString = JSON.stringify(faqs);
    }

    // Use contactNumber if provided, otherwise use a default
    const phoneNumber = contactNumber || '0000000000';

    // Generate a web chat link (will be updated after event creation)
    let chatLink = "/event/placeholder";

    // Create event data
    const eventData: EventCreateInput = {
      name,
      organizer,
      details: details.substring(0, 5000), // Limit details to 5000 chars
      startTime: startTime || null,
      endTime: endTime || null,
      date: date || null,
      time: timeString,
      contactNumber: phoneNumber,
      chatLink,
      faqs: faqsString,
      // Create an enhanced context with structured information for the chatbot
      context: formatEventContextWithFaqs(name, organizer, timeString, phoneNumber, details, faqs),
    };

    console.log('Event data prepared for saving');

    // Save event to JSON file
    const event = jsonStorage.createEvent(eventData);

    console.log('Event created successfully with ID:', event.id);

    // Update the chat link with the actual event ID
    chatLink = `/event/${event.id}`;

    // Update the event with the correct chat link
    jsonStorage.updateEvent(event.id, { chatLink });

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
    const events = jsonStorage.getAllEvents();
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

    console.log('Fetching event with ID:', eventId);

    let event;

    // Check if this is a mock event ID
    if (isMockEventId(eventId)) {
      // For mock events, create a temporary event object with default values
      event = createMockEvent(eventId);
      console.log('Created mock event:', event.name);
    } else {
      // Find the event in the JSON storage
      event = jsonStorage.getEventById(eventId);

      if (!event) {
        console.log('Event not found in storage');
        res.status(404).json({ error: "Event not found" });
        return;
      }
    }

    res.status(200).json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

// Removed PDF upload function
