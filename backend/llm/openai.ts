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
You are an event assistant. Based on the following event information, answer the user's question:

Event Info:
${context}

User Question: ${question}

### Guidelines (not visible to user):
1. Answer in a helpful, friendly, and conversational tone
2. Be concise and direct - keep responses under 3 sentences when possible
3. If the exact information is not available in the context, politely say you don't have that specific information
4. Do not make up or assume any information that is not explicitly stated in the context
5. If asked about dates, times, locations, or prices, be very specific based on the context
6. If the user asks something completely unrelated to the event, politely redirect them to ask about the event
7. For questions about travel, accommodation, certificates, goodies, or any other specific details, check if this information is mentioned in the context and respond accordingly
8. Always provide specific answers from the event information, not generic responses
9. If asked about something not mentioned in the context, clearly state that this information was not provided by the organizer
10. Pay special attention to sections like "Parking Information", "Venue Address", "Accommodation Information", etc. when answering related questions
11. For questions about parking, look specifically at the "Parking Information" section if available
12. For questions about food, look specifically at the "Food & Refreshments" section if available
13. For questions about certificates, look specifically at the "Certificates & Rewards" section if available
14. For questions about registration, look specifically at the "Registration Information" section if available
15. If there is a "Frequently Asked Questions" section, check there first for answers to common questions
16. If the user's question is similar to one in the FAQs, use that answer but feel free to elaborate slightly if needed

### Your response (be specific, relevant, and conversational):
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [{
        role: 'system',
        content: 'You are a helpful event assistant that provides accurate information about events based only on the provided context. You should answer questions in a natural, conversational way, but only use information that is explicitly provided in the context. For any information not available in the context, clearly state that this information was not provided by the event organizer. Never make up information. Be specific and detailed in your responses, using the exact information from the context whenever possible.'
      },
      { role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
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

  // Extract key information from context
  const timeMatch = context.match(/\b\d{1,2}[:.:]\d{2}\b/);
  const dateMatch = context.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}\b/) || context.match(/\b\d{4}-\d{2}-\d{2}\b/);
  const locationMatch = context.match(/(?:at|in)\s+([^.,]+)/);
  const organizerMatch = context.match(/Organizer:\s*([^\n]+)/) || context.match(/organized by\s+([^.,]+)/);

  // Check for travel and accommodation
  const hasTravelInfo = context.toLowerCase().includes('travel') || context.toLowerCase().includes('transport');
  const hasAccommodationInfo = context.toLowerCase().includes('accommodation') || context.toLowerCase().includes('hotel') || context.toLowerCase().includes('stay');
  const hasCertificateInfo = context.toLowerCase().includes('certificate');
  const hasGoodiesInfo = context.toLowerCase().includes('goodies') || context.toLowerCase().includes('swag');

  // Check for common questions and provide canned responses
  if (lowerQuestion.includes('when') || lowerQuestion.includes('time') || lowerQuestion.includes('date')) {
    // Look for date/time in the context directly
    const dateTimeLines = context.split('\n').filter(line =>
      line.toLowerCase().includes('date') ||
      line.toLowerCase().includes('time') ||
      line.toLowerCase().includes('when')
    );

    if (dateTimeLines.length > 0) {
      return `${dateTimeLines[0].trim()}. Please make sure to arrive on time as the program will start promptly.`;
    } else if (timeMatch && dateMatch) {
      return `The event is scheduled for ${dateMatch[0]} at ${timeMatch[0]}. Please make sure to arrive on time as the program will start promptly.`;
    } else if (timeMatch) {
      return `The event starts at ${timeMatch[0]}. I don't have the specific date information in my records.`;
    } else if (dateMatch) {
      return `The event is scheduled for ${dateMatch[0]}. I don't have the specific time information in my records.`;
    } else {
      return `I don't have specific information about the date and time in the event details. Please contact the organizer for this information.`;
    }
  }

  if (lowerQuestion.includes('where') || lowerQuestion.includes('location') || lowerQuestion.includes('venue')) {
    if (locationMatch) {
      return `The event will be held at ${locationMatch[1]}. You can find more details about the venue in the event information provided by the organizer.`;
    } else {
      return `I don't have specific information about the location in the event details. The organizer hasn't provided venue information.`;
    }
  }

  if (lowerQuestion.includes('organizer') || lowerQuestion.includes('who') || lowerQuestion.includes('host')) {
    if (organizerMatch) {
      return `This event is organized by ${organizerMatch[1]}. You can contact them for any additional information about the event.`;
    } else {
      const contextLines = context.split('\n');
      for (const line of contextLines) {
        if (line.toLowerCase().includes('organizer') || line.toLowerCase().includes('organized by')) {
          return `Based on the event information, ${line.trim()}. You can contact them for any additional details.`;
        }
      }
      return `I don't have specific information about the organizer in the event details.`;
    }
  }

  if (lowerQuestion.includes('cost') || lowerQuestion.includes('price') || lowerQuestion.includes('fee') || lowerQuestion.includes('free')) {
    if (context.toLowerCase().includes('free')) {
      return `Good news! Based on the information provided, this event is free to attend.`;
    } else if (context.toLowerCase().includes('cost') || context.toLowerCase().includes('price') || context.toLowerCase().includes('fee')) {
      const costLines = context.split('\n').filter(line =>
        line.toLowerCase().includes('cost') ||
        line.toLowerCase().includes('price') ||
        line.toLowerCase().includes('fee')
      );
      if (costLines.length > 0) {
        return `Regarding the cost: ${costLines[0].trim()}`;
      }
    }
    return `I don't have specific information about the cost in the event details. The organizer hasn't provided pricing information.`;
  }

  if (lowerQuestion.includes('travel') || lowerQuestion.includes('transport') || lowerQuestion.includes('how to get')) {
    if (hasTravelInfo) {
      const travelLines = context.split('\n').filter(line =>
        line.toLowerCase().includes('travel') ||
        line.toLowerCase().includes('transport')
      );
      if (travelLines.length > 0) {
        return `Regarding travel arrangements: ${travelLines[0].trim()}`;
      }
    }
    return `I don't see any specific information about travel arrangements in the event details. The organizer hasn't provided travel information.`;
  }

  if (lowerQuestion.includes('accommodation') || lowerQuestion.includes('hotel') || lowerQuestion.includes('stay')) {
    if (hasAccommodationInfo) {
      const accommodationLines = context.split('\n').filter(line =>
        line.toLowerCase().includes('accommodation') ||
        line.toLowerCase().includes('hotel') ||
        line.toLowerCase().includes('stay')
      );
      if (accommodationLines.length > 0) {
        return `Regarding accommodation: ${accommodationLines[0].trim()}`;
      }
    }
    return `I don't see any specific information about accommodation arrangements in the event details. The organizer hasn't provided accommodation information.`;
  }

  if (lowerQuestion.includes('certificate') || lowerQuestion.includes('certification')) {
    if (hasCertificateInfo) {
      const certificateLines = context.split('\n').filter(line =>
        line.toLowerCase().includes('certificate')
      );
      if (certificateLines.length > 0) {
        return `Regarding certificates: ${certificateLines[0].trim()}`;
      }
    }
    return `I don't see any specific information about certificates in the event details. The organizer hasn't mentioned whether certificates will be provided.`;
  }

  if (lowerQuestion.includes('goodies') || lowerQuestion.includes('swag') || lowerQuestion.includes('gift')) {
    if (hasGoodiesInfo) {
      const goodiesLines = context.split('\n').filter(line =>
        line.toLowerCase().includes('goodies') ||
        line.toLowerCase().includes('swag') ||
        line.toLowerCase().includes('gift')
      );
      if (goodiesLines.length > 0) {
        return `Regarding goodies or swag: ${goodiesLines[0].trim()}`;
      }
    }
    return `I don't see any specific information about goodies or swag in the event details. The organizer hasn't mentioned whether these will be provided.`;
  }

  // Check for FAQs that might match the question
  if (context.includes('Frequently Asked Questions') || context.includes('FAQs')) {
    // Extract FAQs from the context
    const faqSection = context.split('Frequently Asked Questions:')[1];
    if (faqSection) {
      const faqPairs = faqSection.split('Q:').slice(1);
      for (const faqPair of faqPairs) {
        const question = faqPair.split('A:')[0].trim().toLowerCase();
        const answer = faqPair.split('A:')[1]?.split('\n\n')[0].trim();

        // Check if the user's question is similar to this FAQ
        const questionWords = lowerQuestion.split(' ');
        const faqWords = question.split(' ');

        // Count matching words
        const matchingWords = questionWords.filter(word =>
          faqWords.some(faqWord => faqWord.includes(word) || word.includes(faqWord))
        );

        if (matchingWords.length >= 2 && answer) {
          return `${answer}`;
        }
      }
    }
  }

  // For any other question, try to find relevant information in the context
  const keywords = lowerQuestion.split(' ')
    .filter(word => word.length > 3) // Only consider words longer than 3 characters
    .filter(word => !['what', 'when', 'where', 'who', 'how', 'will', 'there', 'about', 'have', 'does', 'the', 'this', 'that', 'with', 'from'].includes(word));

  if (keywords.length > 0) {
    for (const keyword of keywords) {
      const relevantLines = context.split('\n').filter(line =>
        line.toLowerCase().includes(keyword)
      );
      if (relevantLines.length > 0) {
        return `Based on the event information, I found this relevant detail: ${relevantLines[0].trim()}`;
      }
    }
  }

  // Default response for other questions
  return `Thank you for your question about "${question}". Based on the event information provided, I don't have specific details about this. The organizer hasn't included this information in the event details.`;
};
