import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { message, conversation_history } = await req.json();

    if (!process.env.GOOGLE_API_KEY) {
        return NextResponse.json(
            { error: 'GOOGLE_API_KEY is not configured' },
            { status: 500 }
        );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Construct the prompt with context
    // We can use the conversation history to build a proper chat session
    const chat = model.startChat({
      history: conversation_history?.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })) || [],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const systemInstruction = `You are a helpful, empathetic, and knowledgeable Finance Coach for rural India. 
    Your goal is to help users with financial literacy, government schemes, budgeting, and investment advice in a simple, easy-to-understand manner. 
    You should answer in the language the user is speaking if possible, or in English if not specified, but be ready to handle multiple Indian languages.
    Keep your answers concise and actionable. Avoid complex financial jargon.`;

    // Send the user's message
    const result = await chat.sendMessage(`${systemInstruction}\n\nUser message: ${message}`);
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
