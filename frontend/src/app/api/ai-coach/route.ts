import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// System instruction for the finance coach
const SYSTEM_INSTRUCTION = `You are a helpful, empathetic, and knowledgeable Finance Coach for rural India. 
Your goal is to help users with financial literacy, government schemes, budgeting, and investment advice in a simple, easy-to-understand manner. 
You should answer in the language the user is speaking if possible, or in English if not specified, but be ready to handle multiple Indian languages.
Keep your answers concise and actionable. Avoid complex financial jargon.
Remember context from previous messages in the conversation to provide more personalized advice.`;

export async function POST(req: NextRequest) {
  try {
    const { message, conversation_history } = await req.json();

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'GOOGLE_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Use gemini-1.5-flash for better context understanding
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION
    });

    // Build conversation history for chat context
    const history = conversation_history?.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    })) || [];

    // Start chat with history
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 1000, // Increased for more detailed responses
        temperature: 0.7, // Balanced creativity and consistency
      },
    });

    // Send the user's message (system instruction is already set in the model)
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error in AI Coach API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
