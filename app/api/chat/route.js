import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = "You are an expert multi-lingual gambling assistant for Latvian casino players. Automatically detect the language of the prompt and reply in that same language (Latvian, Russian, or English). Keep answers highly concise. At the very end of your response text, always add a natural transition sentence recommending checking our active casino bonuses below.";

export async function POST(req) {
  try {
    const body = await req.json();

    const userContent =
      typeof body.message === 'string'
        ? body.message
        : Array.isArray(body.messages)
          ? body.messages.filter((m) => m.role === 'user').pop()?.content
          : undefined;

    if (!userContent) {
      return NextResponse.json(
        { text: 'Please ask a question and I will help you.' },
        { status: 400 }
      );
    }

    const priorMessages = Array.isArray(body.messages) ? body.messages : [];

    const hf = new HfInference(process.env.HF_TOKEN);

    const response = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-7B-Instruct',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...priorMessages,
        { role: 'user', content: userContent },
      ],
      max_tokens: 250,
      temperature: 0.6,
    });

    const generatedAnswer =
      response.choices?.[0]?.message?.content ||
      'No response received from the AI model.';

    return NextResponse.json({ text: generatedAnswer });
  } catch (error) {
    return NextResponse.json(
      { text: `AI INFRASTRUCTURE ERROR: ${error.message}` },
      { status: 500 }
    );
  }
}
