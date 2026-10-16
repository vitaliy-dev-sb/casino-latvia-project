import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT =
  'You are an expert multi-lingual gambling assistant for Latvian casino players. Automatically detect the language of the prompt and reply in that same language (Latvian, Russian, or English). Keep answers highly concise. At the very end of your response text, always add a natural transition sentence recommending checking our active casino bonuses below.';

const HF_MODEL = 'Qwen/Qwen2.5-7B-Instruct';
const HF_ENDPOINT = `https://api-inference.huggingface.co/models/${HF_MODEL}/v1/chat/completions`;

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

    const token = process.env.HF_TOKEN;
    if (!token) {
      return NextResponse.json(
        { text: 'AI INFRASTRUCTURE ERROR: HF_TOKEN is not configured on the server.' },
        { status: 500 }
      );
    }

    const hfResponse = await fetch(HF_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...priorMessages,
          { role: 'user', content: userContent },
        ],
        max_tokens: 250,
        temperature: 0.6,
      }),
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      return NextResponse.json(
        { text: `AI INFRASTRUCTURE ERROR: Hugging Face API returned ${hfResponse.status} ${hfResponse.statusText} — ${errorText}` },
        { status: 502 }
      );
    }

    const data = await hfResponse.json();
    const generatedAnswer =
      data.choices?.[0]?.message?.content ||
      'No response received from the AI model.';

    return NextResponse.json({ text: generatedAnswer });
  } catch (error) {
    return NextResponse.json(
      { text: `AI INFRASTRUCTURE ERROR: ${error.message}` },
      { status: 500 }
    );
  }
}
