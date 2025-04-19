// services/twilioBot.ts
import twilio from 'twilio';
import dotenv from 'dotenv';
import { generateResponseFromContext } from '../llm/openai';
import prisma from './prismaService';

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Handle incoming WhatsApp messages
 * @param from User's WhatsApp number
 * @param body Message content
 * @returns Response message
 */
export const handleWhatsAppMessage = async (
  from: string,
  body: string
): Promise<string> => {
  try {
    // Extract the event name from the message or use a default approach
    // This is a simple implementation - in a real app, you might want to track conversations
    const eventName = extractEventName(body);

    // Find the event in the database
    const event = await findEventByNameOrNumber(eventName, from);

    if (!event) {
      return "Sorry, I couldn't find information about this event. Please make sure you're using the correct link.";
    }

    // Generate response using OpenAI
    const response = await generateResponseFromContext(event.context || event.details, body);

    return response;
  } catch (error) {
    console.error('Error handling WhatsApp message:', error);
    return 'Sorry, I encountered an error while processing your message. Please try again later.';
  }
};

/**
 * Send a WhatsApp message using Twilio
 * @param to Recipient's WhatsApp number
 * @param body Message content
 */
export const sendWhatsAppMessage = async (
  to: string,
  body: string
): Promise<void> => {
  try {
    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${to}`,
      body,
    });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw new Error('Failed to send WhatsApp message');
  }
};

/**
 * Extract event name from message
 * This is a simple implementation - in a real app, you might want to use NLP
 */
const extractEventName = (message: string): string => {
  // Look for event name in common patterns
  const eventRegex = /about\s+([^\.!?]+)/i;
  const match = message.match(eventRegex);

  if (match && match[1]) {
    return match[1].trim();
  }

  // If no match, return empty string
  return '';
};

/**
 * Find event by name or WhatsApp number
 */
const findEventByNameOrNumber = async (
  eventName: string,
  phoneNumber: string
): Promise<any> => {
  // Remove 'whatsapp:' prefix if present
  const cleanNumber = phoneNumber.replace('whatsapp:', '');

  // Try to find by event name first
  if (eventName) {
    const events = await prisma.event.findMany({
      where: {
        name: {
          contains: eventName
        }
      }
    });

    if (events.length > 0) return events[0];
  }

  // If not found by name, try to find by WhatsApp number
  const events = await prisma.event.findMany({
    where: {
      whatsappNumber: cleanNumber
    }
  });

  return events.length > 0 ? events[0] : null;
};
