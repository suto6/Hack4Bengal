// llm/openai.ts
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const prompt = `
You are an event assistant.

Context:
${context}

User Question:
"${question}"

Answer in a helpful, friendly tone. If the information is not available in the context, politely say you don't have that information.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error generating response from OpenAI:', error);
    return 'Sorry, I encountered an error while processing your question. Please try again later.';
  }
};
