import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const HF_MODEL = 'meta-llama/Llama-3.1-8B-Instruct';
const HF_ENDPOINT = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
const TIMEOUT_MS = 8000;

const SYSTEM_PROMPT =
  'You are an expert multi-lingual gambling assistant for Latvian casino players. Automatically detect the prompt language and reply in that same language (Latvian, Russian, or English). Keep answers concise. At the very end of your response, always recommend checking active casino bonuses below.';

type ChatRole = 'user' | 'assistant';

interface IncomingMessage {
  role: ChatRole;
  content: string;
}

function buildPrompt(userText: string, priorMessages: IncomingMessage[]): string {
  const conversation = priorMessages
    .map((m) =>
      m.role === 'user'
        ? `<|start_header_id|>user<|end_header_id|>\n\n${m.content}<|eot_id|>`
        : `<|start_header_id|>assistant<|end_header_id|>\n\n${m.content}<|eot_id|>`
    )
    .join('\n');

  return (
    `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${SYSTEM_PROMPT}<|eot_id|>\n` +
    conversation +
    `<|start_header_id|>user<|end_header_id|>\n\n${userText}<|eot_id|>\n` +
    `<|start_header_id|>assistant<|end_header_id|>\n\n`
  );
}

async function callHuggingFace(token: string, prompt: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(HF_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.6,
          return_full_text: false,
        },
      }),
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

function extractAnswer(data: unknown): string {
  if (Array.isArray(data) && data.length > 0) {
    const raw = (data[0] as { generated_text?: string }).generated_text || '';
    return raw.replace(/<\|eot_id\|>/g, '').trim();
  }
  if (typeof data === 'object' && data !== null && 'generated_text' in data) {
    return ((data as { generated_text: string }).generated_text).replace(/<\|eot_id\|>/g, '').trim();
  }
  return 'No response received from the AI model.';
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: unknown = await req.json();

    const bodyObj = body as { message?: string; messages?: IncomingMessage[] };
    const userContent =
      typeof bodyObj.message === 'string'
        ? bodyObj.message
        : Array.isArray(bodyObj.messages)
          ? bodyObj.messages.filter((m) => m.role === 'user').pop()?.content
          : undefined;

    if (!userContent) {
      return NextResponse.json(
        { text: 'Please ask a question and I will help you.' },
        { status: 400 }
      );
    }

    const priorMessages = Array.isArray(bodyObj.messages)
      ? bodyObj.messages.filter((m) => m.role === 'user' || m.role === 'assistant')
      : [];

    const prompt = buildPrompt(userContent, priorMessages);

    const token = process.env.HF_TOKEN;
    if (!token) {
      return NextResponse.json(
        { text: 'AI service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const hfResponse = await callHuggingFace(token, prompt);

    if (!hfResponse.ok) {
      return NextResponse.json(
        { text: 'The AI assistant is currently unavailable. Please try again shortly.' },
        { status: 502 }
      );
    }

    const data: unknown = await hfResponse.json();
    const answer = extractAnswer(data);

    return NextResponse.json({ text: answer });
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
