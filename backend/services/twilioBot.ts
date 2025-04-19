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
    // Check if this is a join code message
    const joinCodeRegex = /^join\s+([\w-]+)$/i;
    const joinMatch = body.match(joinCodeRegex);

    if (joinMatch && joinMatch[1]) {
      const joinCode = `join ${joinMatch[1]}`;

      // Find the event with this join code
      const event = await findEventByJoinCode(joinCode);

      if (event) {
        return `Welcome to the ${event.name} event assistant! You can now ask me any questions about the event.`;
      } else {
        return "I couldn't find an event with that code. Please check and try again.";
      }
    }

    // For regular messages, try to find the event by name or previous interactions
    const eventName = extractEventName(body);

    // Find the event in the database
    const event = await findEventByNameOrNumber(eventName, from);

    if (!event) {
      return "Sorry, I couldn't find information about this event. Please make sure you're using the correct join code.";
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
  // First, try to match the format "interested in the event: [Event Name]"
  const interestedRegex = /interested in the event:\s*([^\.!?]+)/i;
  const interestedMatch = message.match(interestedRegex);

  if (interestedMatch && interestedMatch[1]) {
    return interestedMatch[1].trim();
  }

  // If that doesn't match, try other common patterns
  const aboutRegex = /about\s+([^\.!?]+)/i;
  const aboutMatch = message.match(aboutRegex);

  if (aboutMatch && aboutMatch[1]) {
    return aboutMatch[1].trim();
  }

  // If no specific pattern matches, try to extract any potential event name
  // This is a simple approach - just take the first few words if they might be a name
  const words = message.split(/\s+/).slice(0, 5).join(' ');
  if (words.length > 3) {
    return words;
  }

  // If no match, return empty string
  return '';
};

/**
 * Find event by join code
 */
const findEventByJoinCode = async (joinCode: string): Promise<any> => {
  // Use raw SQL query to find the event by join code
  // This bypasses the Prisma type issues
  try {
    const events = await prisma.event.findMany();
    // Use type assertion to tell TypeScript that the event object includes joinCode
    return events.find(event => (event as any).joinCode === joinCode);
  } catch (error) {
    console.error('Error finding event by join code:', error);
    return null;
  }
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
