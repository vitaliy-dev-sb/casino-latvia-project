const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct";
const HF_ENDPOINT = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
const TIMEOUT_MS = 8000;
const MAX_RETRIES = 2;

const SYSTEM_PROMPT =
  "You are an expert multi-lingual gambling assistant for Latvian casino players. Automatically detect the language of the prompt and reply in that same language (Latvian, Russian, or English). Keep answers highly concise. At the very end of your response text, always add a natural transition sentence recommending checking our active casino bonuses below.";

function buildPrompt(userText: string, priorMessages: Array<{ role: string; content: string }>): string {
  const conversation = priorMessages
    .map((m) =>
      m.role === "user"
        ? `<|start_header_id|>user<|end_header_id|>\n\n${m.content}<|eot_id|>`
        : m.role === "assistant"
          ? `<|start_header_id|>assistant<|end_header_id|>\n\n${m.content}<|eot_id|>`
          : ""
    )
    .filter(Boolean)
    .join("\n");

  return (
    `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${SYSTEM_PROMPT}<|eot_id|>\n` +
    conversation +
    `<|start_header_id|>user<|end_header_id|>\n\n${userText}<|eot_id|>\n` +
    `<|start_header_id|>assistant<|end_header_id|>\n\n`
  );
}

function extractAnswer(data: unknown): string {
  if (Array.isArray(data) && data.length > 0) {
    const raw = (data[0] as { generated_text?: string }).generated_text || "";
    return raw.replace(/<\|eot_id\|>/g, "").trim();
  }
  if (typeof data === "object" && data !== null && "generated_text" in data) {
    const raw = (data as { generated_text?: string }).generated_text || "";
    return raw.replace(/<\|eot_id\|>/g, "").trim();
  }
  return "No response received from the AI model.";
}

async function callHuggingFace(token: string, prompt: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(HF_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const userContent =
      typeof body.message === "string"
        ? body.message
        : Array.isArray(body.messages)
          ? body.messages.filter((m: { role: string }) => m.role === "user").pop()?.content
          : undefined;

    if (!userContent) {
      return jsonResponse({ text: "Please ask a question and I will help you." }, 400);
    }

    const priorMessages = Array.isArray(body.messages) ? body.messages : [];
    const prompt = buildPrompt(userContent, priorMessages);

    const token = Deno.env.get("HF_TOKEN");
    if (!token) {
      return jsonResponse({ text: "AI INFRASTRUCTURE ERROR: HF_TOKEN is not configured." }, 500);
    }

    let lastError = "";
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const hfResponse = await callHuggingFace(token, prompt);

        if (hfResponse.status === 503 && attempt < MAX_RETRIES) {
          const errorBody = await hfResponse.json().catch(() => ({ estimated_time: 3 }));
          const waitMs = Math.min((errorBody.estimated_time || 3) * 1000, 3000);
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          lastError = `Model loading (attempt ${attempt + 1}/${MAX_RETRIES + 1})`;
          continue;
        }

        if (!hfResponse.ok) {
          const errorText = await hfResponse.text();
          return jsonResponse(
            { text: `AI INFRASTRUCTURE ERROR: Hugging Face API returned ${hfResponse.status} ${hfResponse.statusText} — ${errorText}` },
            502
          );
        }

        const data = await hfResponse.json();
        const generatedAnswer = extractAnswer(data);
        return jsonResponse({ text: generatedAnswer });
      } catch (fetchError) {
        if (fetchError.name === "AbortError") {
          if (attempt < MAX_RETRIES) {
            lastError = `Timeout on attempt ${attempt + 1}/${MAX_RETRIES + 1}`;
            continue;
          }
          return jsonResponse(
            { text: `AI INFRASTRUCTURE ERROR: Request to Hugging Face timed out after ${TIMEOUT_MS / 1000}s across ${MAX_RETRIES + 1} attempts. The model may be under heavy load — please try again.` },
            504
          );
        }
        if (attempt < MAX_RETRIES) {
          lastError = fetchError.message;
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        return jsonResponse(
          { text: `AI INFRASTRUCTURE ERROR: Fetch failed — ${fetchError.message}` },
          502
        );
      }
    }

    return jsonResponse(
      { text: `AI INFRASTRUCTURE ERROR: All retries exhausted. Last error: ${lastError}` },
      503
    );
  } catch (error) {
    return jsonResponse({ text: `AI INFRASTRUCTURE ERROR: ${error.message}` }, 500);
  }
});
