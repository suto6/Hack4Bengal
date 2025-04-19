// llm/openai.ts
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Check if OpenAI API key is available
const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

// Initialize OpenAI client if API key is available
let openai: OpenAI | null = null;
if (hasOpenAIKey) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn('OpenAI API key not found. Using mock responses for development.');
}

/**
 * Generate a response from OpenAI based on the event context and user question
 * @param context Event details and context
 * @param question User's question
 * @returns AI-generated response
 */
export const generateResponseFromContext = async (
  context: string,
  question: string
): Promise<string> => {
  try {
    // If OpenAI API key is not available, return a mock response
    if (!hasOpenAIKey || !openai) {
      return generateMockResponse(context, question);
    }

    const prompt = `
You are an AI event assistant for an event organizer. Your job is to answer questions about a specific event based ONLY on the information provided in the context below.

Event Information:
${context}

User Question:
"${question}"

Guidelines:
1. Answer in a helpful, friendly, and conversational tone
2. Be concise and direct - keep responses under 3 sentences when possible
3. If the exact information is not available in the context, politely say you don't have that specific information
4. Do not make up or assume any information that is not explicitly stated in the context
5. If asked about dates, times, locations, or prices, be very specific based on the context
6. If the user asks something completely unrelated to the event, politely redirect them to ask about the event

Your response:
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'You are a helpful event assistant that provides accurate information about events based only on the provided context.' },
                { role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.5,
    });

    return response.choices[0].message.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error generating response from OpenAI:', error);
    return 'Sorry, I encountered an error while processing your question. Please try again later.';
  }
};

/**
 * Generate a mock response for development when OpenAI API key is not available
 * @param context Event details and context
 * @param question User's question
 * @returns Mock response
 */
const generateMockResponse = (context: string, question: string): string => {
  // Convert question to lowercase for easier matching
  const lowerQuestion = question.toLowerCase();

  // Check for common questions and provide canned responses
  if (lowerQuestion.includes('when') && lowerQuestion.includes('start')) {
    // Extract time from context if available
    const timeMatch = context.match(/\b\d{1,2}[:.:]\d{2}\b/);
    const dateMatch = context.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}\b/);

    if (timeMatch && dateMatch) {
      return `The event starts at ${timeMatch[0]} on ${dateMatch[0]}.`;
    } else if (timeMatch) {
      return `The event starts at ${timeMatch[0]}.`;
    } else if (dateMatch) {
      return `The event is scheduled for ${dateMatch[0]}.`;
    } else {
      return `I don't have specific information about the start time in my records.`;
    }
  }

  if (lowerQuestion.includes('where') || lowerQuestion.includes('location')) {
    // Look for location information in context
    const locationMatch = context.match(/(?:at|in)\s+([^.,]+)/);

    if (locationMatch) {
      return `The event will be held at ${locationMatch[1]}.`;
    } else {
      return `I don't have specific information about the location in my records.`;
    }
  }

  if (lowerQuestion.includes('cost') || lowerQuestion.includes('price') || lowerQuestion.includes('fee')) {
    if (context.toLowerCase().includes('free')) {
      return `Good news! This event is free to attend.`;
    } else {
      return `I don't have specific information about the cost in my records. Please contact the organizer for details.`;
    }
  }

  // Default response for other questions
  return `Thank you for your question. As this is a development environment without OpenAI API access, I can only provide limited responses. In production, I would use the event details to give you a more specific answer.`;
};
