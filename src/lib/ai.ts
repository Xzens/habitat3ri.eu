/**
 * XAI (Grok) API client for embeddings and chat completions.
 * Uses the OpenAI-compatible API format.
 */

const XAI_BASE_URL = "https://api.x.ai/v1";

function getApiKey(): string {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error("XAI_API_KEY is not set");
  return key;
}

/** Generate an embedding vector for a text string. */
export async function generateEmbedding(text: string): Promise<number[]> {
  const model = process.env.XAI_EMBEDDING_MODEL || "grok-2-embedding-large";

  const res = await fetch(`${XAI_BASE_URL}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model,
      input: text,
      encoding_format: "float",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embedding API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

/** Generate embeddings for multiple texts in a single batch. */
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  const model = process.env.XAI_EMBEDDING_MODEL || "grok-2-embedding-large";

  const res = await fetch(`${XAI_BASE_URL}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model,
      input: texts,
      encoding_format: "float",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embedding API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.data
    .sort((a: { index: number }, b: { index: number }) => a.index - b.index)
    .map((d: { embedding: number[] }) => d.embedding);
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

/** Chat completion with streaming support. Returns a ReadableStream. */
export async function chatCompletionStream(
  messages: ChatMessage[]
): Promise<ReadableStream<Uint8Array>> {
  const model = process.env.XAI_CHAT_MODEL || "grok-3-mini";

  const res = await fetch(`${XAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Chat API error ${res.status}: ${err}`);
  }

  return res.body!;
}

/** Non-streaming chat completion. */
export async function chatCompletion(
  messages: ChatMessage[]
): Promise<string> {
  const model = process.env.XAI_CHAT_MODEL || "grok-3-mini";

  const res = await fetch(`${XAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Chat API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

/**
 * Split long text into overlapping chunks for embedding.
 * Each chunk is ~500 tokens (~2000 chars) with 200-char overlap.
 */
export function chunkText(
  text: string,
  maxChars = 2000,
  overlap = 200
): string[] {
  if (text.length <= maxChars) return [text];

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = start + maxChars;

    // Try to break at sentence boundary
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf(". ", end);
      const lastNewline = text.lastIndexOf("\n", end);
      const breakPoint = Math.max(lastPeriod, lastNewline);
      if (breakPoint > start + maxChars / 2) {
        end = breakPoint + 1;
      }
    }

    chunks.push(text.slice(start, end).trim());
    start = end - overlap;
  }

  return chunks.filter((c) => c.length > 50);
}
