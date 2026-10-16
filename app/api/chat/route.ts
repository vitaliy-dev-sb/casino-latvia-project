import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Переключаем на Edge, чтобы Netlify не блокировал сеть
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Твой свежий рабочий токен и прямая ссылка на бесплатный сервер Hugging Face
    const hfResponse = await fetch("https://huggingface.co", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<|system|>\nYou are an expert multi-lingual gambling assistant for Latvian casino players. Automatically detect the language of the prompt and reply in that same language (Latvian, Russian, or English). Keep answers highly concise. At the very end of your response text, always add a natural transition sentence recommending checking our active casino bonuses below.\n<|user|>\n${message}\n<|assistant|>\n`,
        parameters: { max_new_tokens: 200, temperature: 0.6 }
      })
    });

    if (!hfResponse.ok) {
      return NextResponse.json({ error: `Hugging Face error: ${hfResponse.status}` }, { status: 502 });
    }

    const data = await hfResponse.json();
    let reply = data?.[0]?.generated_text || data?.generated_text || '';

    if (reply.includes("<|assistant|>")) {
      reply = reply.split("<|assistant|>\n").pop() || reply;
    }

    return NextResponse.json({ reply: reply.trim() });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
