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
    const context = event.context || event.details;
    const response = await generateResponseFromContext(context, message);

    res.status(200).json({ response });
  } catch (error) {
    console.error("Error handling chat message:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
};
