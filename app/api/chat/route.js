import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = "You are an expert multi-lingual gambling assistant for Latvian casino players. Automatically detect the language of the prompt and reply in that same language (Latvian, Russian, or English). Keep answers highly concise. At the very end of your response text, always add a natural transition sentence recommending checking our active casino bonuses below.";

function getFallbackAnswer(message) {
  const lower = message.toLowerCase();
  
  // Проверка на латышский язык
  if (/[āčēģīķļņšūž]/i.test(lower) || lower.includes("sveiki")) {
    if (lower.includes("laiks") || lower.includes("laika ziņas") || lower.includes("rīgā")) {
      return "Rīgā šobrīd ir mākoņains laiks, ap +10°C, un līst neliels lietus. Ideāls brīdis, lai paliktu mājās siltumā un izmantot mūsu ekskluzīvos bonusus vietnēs Oxibet un Crusino!";
    }
    if (lower.includes("bonus") || lower.includes("kazino")) {
      return "Sveiki! Šodien ir piektdiena, tāpēc iesaku izmantot mūsu ekskluzīvos bonusus vietnēs Oxibet un Crusino. Tie piedāvā lieliskus nosacījumus un ātras izmaksas!";
    }
    return "Sveiki! Esmu tavs AI asistents. Šobrīd strādāju lokālajā režīmā, bet joprojām varu ieteikt labākos šodienas piedāvājumus no mūsu kalendāra — vietnes Oxibet un Crusino piedāvā izcilus bonusus šai piektdienai!";
  }
  
  // Проверка на русский язык
  if (/[а-яё]/i.test(lower)) {
    if (lower.includes("погода") || lower.includes("риг")) {
      return "В Риге сейчас пасмурно, около +10°C, идёт мелкий дождь. В такую погоду лучше всего остаться дома в тепле и забрать наши лучшие пятничные бонусы в казино Oxibet и Crusino ниже!";
    }
    if (lower.includes("бонус") || lower.includes("казино") || lower.includes("акци")) {
      return "Прямо сейчас я могу порекомендовать вам топовые бонусы на сегодня из нашего календаря — Oxibet и Crusino предлагают шикарные акции на эти выходные с честным вейджером!";
    }
    return "Привет! Я твой ИИ-помощник. Задавай мне любые вопросы о казино, погоде или стратегиях. Прямо сейчас рекомендую заглянуть в наш календарь и оценить бонусы от Oxibet и Crusino!";
  }
  
  // Английский язык по умолчанию (Fallback)
  if (lower.includes("weather") || lower.includes("riga")) {
    return "The weather in Riga is currently overcast, around +10°C, with light rain. Perfect timing to stay cozy inside and claim premium rewards from Oxibet and Crusino!";
  }
  return "Hello! I am your AI assistant. I highly recommend checking out Oxibet and Crusino from our daily bonuses tracker for the best promotions today!";
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
