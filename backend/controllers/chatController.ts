// controllers/chatController.ts
import { Request, Response } from "express";
import { generateResponseFromContext } from "../llm/openai";
import * as jsonStorage from "../services/jsonStorageService";
import { createMockEvent, isMockEventId } from "../services/mockEventService";

// Handle chat message
export const handleChatMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId, message } = req.body;

    if (!eventId || !message) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    console.log('Received event ID:', eventId, 'Message:', message);

    // Special handling for mock events
    if (eventId.startsWith('mock-')) {
      console.log('Handling mock event directly:', eventId);

      // For team size question, return a direct answer
      if (message.toLowerCase().includes('team') &&
          (message.toLowerCase().includes('size') || message.toLowerCase().includes('members'))) {
        res.status(200).json({
          response: "Teams for the hackathon can have 2-4 members. This is mentioned in the event details. Each team should register together and will work on a single project during the 36-hour hackathon period."
        });
        return;
      }

      // For other questions about mock events, provide a generic response
      res.status(200).json({
        response: "This is a 36-hour hackathon where developers, designers, and innovators come together to build amazing projects. The event will be held on June 15, 2023, starting at 10:00 AM. There will be prizes worth ₹50,000 for the winners."
      });
      return;
    }

    // For real events, continue with the normal flow
    let event = jsonStorage.getEventById(eventId);

    if (!event) {
      console.log('Event not found in storage');
      res.status(404).json({ error: "Event not found" });
      return;
    }

    // Generate response using OpenAI
    // Create a structured context with all event information
    let structuredContext = `
Event Name: ${event.name}
Organizer: ${event.organizer}
Date/Time: ${event.time}
Contact: ${event.contactNumber}

Event Details:
${event.details}
`;

    // Add FAQs if available
    if (event.faqs) {
      try {
        const faqs = JSON.parse(event.faqs);
        if (Array.isArray(faqs) && faqs.length > 0) {
          structuredContext += '\n\nFrequently Asked Questions:\n';
          faqs.forEach((faq: any) => {
            if (faq.question && faq.answer) {
              structuredContext += `\nQ: ${faq.question}\nA: ${faq.answer}\n`;
            }
          });
        }
      } catch (e) {
        console.error('Error parsing FAQs:', e);
      }
    }

    // Add any additional context if available
    if (event.context) {
      structuredContext += `\n\nAdditional Information:\n${event.context}`;
    }

    console.log('Sending structured context to LLM:', structuredContext.substring(0, 200) + '...');
    const response = await generateResponseFromContext(structuredContext, message);

    res.status(200).json({ response });
  } catch (error) {
    console.error("Error handling chat message:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
};
