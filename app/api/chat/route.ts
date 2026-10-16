import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const HF_ENDPOINT =
  'https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct';
const TIMEOUT_MS = 8000;

const SYSTEM_PROMPT =
  'You are an expert multi-lingual gambling assistant for Latvian casino players. Automatically detect the prompt language and reply in that same language (Latvian, Russian, or English). Keep answers concise. At the very end of your response, always recommend checking active casino bonuses below.';

function buildPrompt(userText: string): string {
  return (
    `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${SYSTEM_PROMPT}<|eot_id|>\n` +
    `<|start_header_id|>user<|end_header_id|>\n\n${userText}<|eot_id|>\n` +
    `<|start_header_id|>assistant<|end_header_id|>\n\n`
  );
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const userText: string | undefined =
      typeof body.message === 'string'
        ? body.message
        : Array.isArray(body.messages)
          ? body.messages.filter((m: { role: string }) => m.role === 'user').pop()?.content
          : undefined;

    if (!userText) {
      return NextResponse.json(
        { text: 'Please ask a question and I will help you.' },
        { status: 400 }
      );
    }

    const token = process.env.HF_TOKEN;
    if (!token) {
      return NextResponse.json(
        { text: 'AI service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let hfResponse: Response;
    try {
      hfResponse = await fetch(HF_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: buildPrompt(userText),
          parameters: {
            max_new_tokens: 200,
            temperature: 0.6,
            return_full_text: false,
          },
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!hfResponse.ok) {
      return NextResponse.json(
        { text: 'The AI assistant is currently unavailable. Please try again shortly.' },
        { status: 502 }
      );
    }

    const data = await hfResponse.json();
    const raw =
      Array.isArray(data) && data.length > 0
        ? data[0].generated_text || ''
        : data?.generated_text || '';
    const reply = raw.replace(/<\|eot_id\|>/g, '').trim();

    return NextResponse.json({ text: reply || 'No response received from the AI model.' });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    return NextResponse.json(
      {
        text: isTimeout
          ? 'The AI assistant took too long to respond. Please try again.'
          : 'Something went wrong. Please try again.',
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
