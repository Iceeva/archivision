import axios from 'axios';
import { config } from '../config';

export type AIProvider = 'openrouter' | 'openai' | 'anthropic' | 'google';

interface AIResponse {
  content: string;
  model: string;
  tokensUsed: number;
}

const ARCHITECTURE_SYSTEM_PROMPT = `Tu es ArchiVision AI, un architecte expert spécialisé en conception de bâtiments résidentiels et commerciaux.

Tes capacités :
- Générer des plans d'architecture détaillés en JSON structuré
- Analyser les dimensions de terrain et proposer des dispositions optimales
- Respecter les normes de construction internationales
- Calculer les surfaces et proportions
- Optimiser les espaces de vie
- Proposer des designs modernes, traditionnels ou luxueux

Quand tu génères un plan, retourne TOUJOURS un JSON structuré avec :
- rooms: tableau des pièces avec {name, type, width, length, x, y, floor}
- walls: tableau des murs avec {x1, y1, x2, y2, thickness}
- doors: tableau des portes avec {x, y, width, rotation}
- windows: tableau des fenêtres avec {x, y, width, wall}
- dimensions: {totalArea, builtArea, floors, height}
- style: description du style architectural

Réponds toujours en français.`;

// ─── OpenRouter ──────────────────────────────────────────
async function callOpenRouter(messages: any[], model?: string): Promise<AIResponse> {
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: model || config.ai.defaultModel,
      messages: [{ role: 'system', content: ARCHITECTURE_SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 8192,
    },
    {
      headers: {
        Authorization: `Bearer ${config.ai.openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://archivision.ai',
        'X-Title': 'ArchiVision AI',
      },
    }
  );

  return {
    content: response.data.choices[0].message.content,
    model: response.data.model,
    tokensUsed: response.data.usage?.total_tokens || 0,
  };
}

// ─── OpenAI ──────────────────────────────────────────────
async function callOpenAI(messages: any[], model?: string): Promise<AIResponse> {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: model || 'gpt-4o',
      messages: [{ role: 'system', content: ARCHITECTURE_SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 8192,
    },
    { headers: { Authorization: `Bearer ${config.ai.openaiKey}` } }
  );

  return {
    content: response.data.choices[0].message.content,
    model: response.data.model,
    tokensUsed: response.data.usage?.total_tokens || 0,
  };
}

// ─── Multi-Provider ──────────────────────────────────────
export async function callAI(
  messages: any[],
  provider?: AIProvider,
  model?: string
): Promise<AIResponse> {
  const selectedProvider = provider || config.ai.defaultProvider;

  const providers: Record<string, () => Promise<AIResponse>> = {
    openrouter: () => callOpenRouter(messages, model),
    openai: () => callOpenAI(messages, model),
  };

  const handler = providers[selectedProvider];
  if (!handler) throw new Error(`Provider IA non supporté: ${selectedProvider}`);

  try {
    return await handler();
  } catch (error: any) {
    // Fallback: essayer OpenRouter si le provider principal échoue
    if (selectedProvider !== 'openrouter' && config.ai.openrouterKey) {
      console.warn(`[AI] Fallback vers OpenRouter après erreur ${selectedProvider}`);
      return await callOpenRouter(messages);
    }
    throw error;
  }
}

// ─── Streaming ───────────────────────────────────────────
export async function streamAI(
  messages: any[],
  onChunk: (chunk: string) => void,
  model?: string
): Promise<void> {
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: model || config.ai.defaultModel,
      messages: [{ role: 'system', content: ARCHITECTURE_SYSTEM_PROMPT }, ...messages],
      stream: true,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${config.ai.openrouterKey}`,
        'Content-Type': 'application/json',
      },
      responseType: 'stream',
    }
  );

  for await (const chunk of response.data) {
    const lines = chunk.toString().split('\n').filter((l: string) => l.startsWith('data: '));
    for (const line of lines) {
      const data = line.replace('data: ', '').trim();
      if (data === '[DONE]') return;
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onChunk(content);
      } catch {}
    }
  }
}
