export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  isFree: boolean;
}

export const AI_MODELS: AIModel[] = [
  { id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', name: 'Dolphin Mistral 24B', provider: 'Venice', description: 'Modèle gratuit, rapide et polyvalent', isFree: true },
  { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B', provider: 'Meta', description: 'Modèle léger et rapide', isFree: true },
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash', provider: 'Google', description: 'Très rapide, bonne compréhension', isFree: true },
  { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek V3', provider: 'DeepSeek', description: 'Excellent en raisonnement technique', isFree: true },
  { id: 'qwen/qwen3-235b-a22b:free', name: 'Qwen 3 235B', provider: 'Alibaba', description: 'Grand modèle, architecture complexe', isFree: true },
  { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1', provider: 'Mistral', description: 'Équilibré performance/vitesse', isFree: true },
];
