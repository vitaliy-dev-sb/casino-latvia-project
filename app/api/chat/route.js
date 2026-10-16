import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const HF_MODEL = 'meta-llama/Llama-3.1-8B-Instruct';
const HF_ENDPOINT = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
const TIMEOUT_MS = 8000;
const MAX_RETRIES = 2;

const SYSTEM_PROMPT =
  'You are an expert multi-lingual gambling assistant for Latvian casino players. Automatically detect the language of the prompt and reply in that same language (Latvian, Russian, or English). Keep answers highly concise. At the very end of your response text, always add a natural transition sentence recommending checking our active casino bonuses below.';

function buildPrompt(userText, priorMessages) {
  const conversation = priorMessages
    .map((m) =>
      m.role === 'user'
        ? `<|start_header_id|>user<|end_header_id|>\n\n${m.content}<|eot_id|>`
        : m.role === 'assistant'
          ? `<|start_header_id|>assistant<|end_header_id|>\n\n${m.content}<|eot_id|>`
          : ''
    )
    .filter(Boolean)
    .join('\n');

  return (
    `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${SYSTEM_PROMPT}<|eot_id|>\n` +
    conversation +
    `<|start_header_id|>user<|end_header_id|>\n\n${userText}<|eot_id|>\n` +
    `<|start_header_id|>assistant<|end_header_id|>\n\n`
  );
}

async function callHuggingFace(token, prompt) {
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
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function extractAnswer(data, prompt) {
  if (Array.isArray(data) && data.length > 0) {
    const raw = data[0].generated_text || '';
    return raw.replace(/<\|eot_id\|>/g, '').trim();
  }
  if (data.generated_text) {
    return data.generated_text.replace(/<\|eot_id\|>/g, '').trim();
  }
  return 'No response received from the AI model.';
}

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
    const prompt = buildPrompt(userContent, priorMessages);

    const token = process.env.HF_TOKEN;
    if (!token) {
      return NextResponse.json(
        { text: 'AI INFRASTRUCTURE ERROR: HF_TOKEN is not configured on the server.' },
        { status: 500 }
      );
    }

    let lastError;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const hfResponse = await callHuggingFace(token, prompt);

        if (hfResponse.status === 503 && attempt < MAX_RETRIES) {
          const errorBody = await hfResponse.json().catch(() => ({}));
          const waitMs = Math.min((errorBody.estimated_time || 3) * 1000, 3000);
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          lastError = `Model loading (attempt ${attempt + 1}/${MAX_RETRIES + 1})`;
          continue;
        }

        if (!hfResponse.ok) {
          const errorText = await hfResponse.text();
          return NextResponse.json(
            { text: `AI INFRASTRUCTURE ERROR: Hugging Face API returned ${hfResponse.status} ${hfResponse.statusText} — ${errorText}` },
            { status: 502 }
          );
        }

        const data = await hfResponse.json();
        const generatedAnswer = extractAnswer(data, prompt);

        return NextResponse.json({ text: generatedAnswer });
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          if (attempt < MAX_RETRIES) {
            lastError = `Timeout on attempt ${attempt + 1}/${MAX_RETRIES + 1}`;
            continue;
          }
          return NextResponse.json(
            { text: `AI INFRASTRUCTURE ERROR: Request to Hugging Face timed out after ${TIMEOUT_MS / 1000}s across ${MAX_RETRIES + 1} attempts. The model may be under heavy load — please try again.` },
            { status: 504 }
          );
        }
        if (attempt < MAX_RETRIES) {
          lastError = fetchError.message;
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        return NextResponse.json(
          { text: `AI INFRASTRUCTURE ERROR: Fetch failed — ${fetchError.message}` },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      { text: `AI INFRASTRUCTURE ERROR: All retries exhausted. Last error: ${lastError}` },
      { status: 503 }
    );
  } catch (error) {
    return NextResponse.json(
      { text: `AI INFRASTRUCTURE ERROR: ${error.message}` },
      { status: 500 }
    );
  }
}
