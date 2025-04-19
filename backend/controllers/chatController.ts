// controllers/chatController.ts
import { Request, Response } from "express";
import { generateResponseFromContext } from "../llm/openai";
import prisma from "../services/prismaService";

// Handle chat message
export const handleChatMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId, message } = req.body;

    if (!eventId || !message) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    // Find the event in the database
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    // Generate response using OpenAI
    // Create a structured context with all event information
    const structuredContext = `
Event Name: ${event.name}
Organizer: ${event.organizer}
Date/Time: ${event.time}
Contact: ${event.contactNumber}

Event Details:
${event.details}

Additional Information:
${event.context || ''}
`;

    console.log('Sending structured context to LLM:', structuredContext.substring(0, 200) + '...');
    const response = await generateResponseFromContext(structuredContext, message);

    res.status(200).json({ response });
  } catch (error) {
    console.error("Error handling chat message:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
};
