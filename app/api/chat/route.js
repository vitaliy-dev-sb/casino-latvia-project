import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = "You are an expert multi-lingual gambling assistant for Latvian casino players. Automatically detect the language of the prompt and reply in that same language (Latvian, Russian, or English). Keep answers highly concise. At the very end of your response text, always add a natural transition sentence recommending checking our active casino bonuses below.";

function getFallbackAnswer(message) {
  if (/[āčēģīķļņšūž]/i.test(message)) {
    return "Sveiki! Esmu tavs AI palīgs. Šobrīd nevaru savienoties ar AI serveri, bet noteikti iesaku apskatīt mūsu labākos kazino bonusus vietnēs Oxibet un Crusino zemāk!";
  }
  if (/[абвгдежзийклмнопрстуфхцчшщъыьэюя]/i.test(message)) {
    return "Привет! Я твой ИИ-ассистент. Сейчас не могу подключиться к серверу, но обязательно рекомендую забрать наши лучшие бонусы в казино Oxibet и Crusino ниже!";
  }
  return "Hello! I'm your AI assistant. I can't reach the AI server right now, but I recommend checking out our best casino bonuses at Oxibet and Crusino below!";
}

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ],
        max_tokens: 200,
        temperature: 0.6
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ text: getFallbackAnswer(message) });
    }

    const data = await response.json();
    const aiAnswer = data.choices?.[0]?.message?.content || "No response content received.";
    return NextResponse.json({ text: aiAnswer });
  } catch (error) {
    const message = typeof req.json === 'function' ? '' : '';
    return NextResponse.json({ text: getFallbackAnswer(message) });
  }
}
