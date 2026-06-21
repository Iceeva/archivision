import { create } from 'zustand';
import type { Project, GeneratedPlan, TerrainConfig, HouseConfig, MaterialEstimate, BudgetEstimate, AIMessage } from '@/types';
import { projectAPI, aiAPI, estimateAPI } from '@/lib/api';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  activePlan: GeneratedPlan | null;
  plans: GeneratedPlan[];
  materials: MaterialEstimate[];
  budgets: BudgetEstimate[];
  aiMessages: AIMessage[];
  isGenerating: boolean;
  isLoading: boolean;

  // Wizard state
  wizardStep: number;
  terrainConfig: TerrainConfig;
  houseConfig: HouseConfig;
  freeDescription: string;

  // Actions
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (name: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;

  // Wizard
  setWizardStep: (step: number) => void;
  setTerrainConfig: (config: Partial<TerrainConfig>) => void;
  setHouseConfig: (config: Partial<HouseConfig>) => void;
  setFreeDescription: (desc: string) => void;

  // Generation
  generatePlans: () => Promise<void>;
  selectPlan: (plan: GeneratedPlan) => void;
  modifyPlan: (instruction: string) => Promise<void>;

  // Estimates
  calculateEstimates: () => Promise<void>;

  // AI Chat
  sendAIMessage: (message: string) => Promise<void>;

  // State setters
  setCurrentProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  projects: [],
  currentProject: null,
  activePlan: null,
  plans: [],
  materials: [],
  budgets: [],
  aiMessages: [],
  isGenerating: false,
  isLoading: false,

  wizardStep: 0,
  terrainConfig: { length: 20, width: 15, type: 'FLAT' as const },
  houseConfig: { houseType: 'MODERN' as const, floors: 1, bedrooms: 3, bathrooms: 2 },
  freeDescription: '',

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const { data } = await projectAPI.list();
      set({ projects: data });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProject: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await projectAPI.get(id);
      set({
        currentProject: data,
        plans: data.plans || [],
        activePlan: data.plans?.find((p: any) => p.id === data.activePlan) || data.plans?.[0] || null,
        materials: data.materials || [],
        budgets: data.budget || [],
        aiMessages: data.aiMessages || [],
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createProject: async (name) => {
    const { terrainConfig, houseConfig, freeDescription } = get();
    const { data } = await projectAPI.create({
      name,
      terrainLength: terrainConfig.length,
      terrainWidth: terrainConfig.width,
      terrainArea: (terrainConfig.length || 20) * (terrainConfig.width || 15),
      terrainOrientation: terrainConfig.orientation,
      terrainType: terrainConfig.type || 'FLAT',
      ...houseConfig,
      freeDescription: freeDescription || undefined,
      country: 'FR',
    });
    set((s) => ({ projects: [data, ...s.projects], currentProject: data }));
    return data;
  },

  deleteProject: async (id) => {
    await projectAPI.delete(id);
    set((s) => ({ projects: s.projects.filter(p => p.id !== id) }));
  },

  duplicateProject: async (id) => {
    const { data } = await projectAPI.duplicate(id);
    set((s) => ({ projects: [data, ...s.projects] }));
  },

  toggleFavorite: async (id) => {
    await projectAPI.favorite(id);
    set((s) => ({
      projects: s.projects.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p),
    }));
  },

  setWizardStep: (step) => set({ wizardStep: step }),
  setTerrainConfig: (config) => set((s) => ({ terrainConfig: { ...s.terrainConfig, ...config } })),
  setHouseConfig: (config) => set((s) => ({ houseConfig: { ...s.houseConfig, ...config } })),
  setFreeDescription: (desc) => set({ freeDescription: desc }),

  generatePlans: async () => {
    const { currentProject, terrainConfig, houseConfig, freeDescription } = get();
    set({ isGenerating: true });

    try {
      const { data } = await aiAPI.generatePlans({
        projectId: currentProject?.id,
        terrain: terrainConfig,
        house: houseConfig,
        freeDescription: freeDescription || undefined,
      });

      set({
        plans: data.plans,
        activePlan: data.plans[0] || null,
      });
    } finally {
      set({ isGenerating: false });
    }
  },

  selectPlan: (plan) => set({ activePlan: plan }),

  modifyPlan: async (instruction) => {
    const { currentProject, activePlan } = get();
    if (!activePlan) return;
    set({ isGenerating: true });

    try {
      const { data } = await aiAPI.modifyPlan({
        projectId: currentProject?.id,
        plan: activePlan,
        instruction,
      });
      set((s) => ({
        activePlan: data.plan,
        plans: s.plans.map(p => p.id === data.plan.id ? data.plan : p),
      }));
    } finally {
      set({ isGenerating: false });
    }
  },

  calculateEstimates: async () => {
    const { currentProject, activePlan, houseConfig } = get();
    if (!activePlan) return;

    const input = {
      projectId: currentProject?.id,
      builtArea: activePlan.dimensions.builtArea,
      floors: activePlan.dimensions.floors,
      bedrooms: houseConfig.bedrooms || 3,
      bathrooms: houseConfig.bathrooms || 1,
      hasGarage: houseConfig.hasGarage || false,
      hasPool: houseConfig.hasPool || false,
      hasTerrace: houseConfig.hasTerrace || false,
      country: currentProject?.country || 'FR',
    };

    const [matRes, budgetRes] = await Promise.all([
      estimateAPI.materials(input),
      estimateAPI.budget(input),
    ]);

    set({ materials: matRes.data.materials, budgets: budgetRes.data.budget });
  },

  sendAIMessage: async (message) => {
    const { currentProject, aiMessages } = get();
    const userMsg: AIMessage = { id: Date.now().toString(), role: 'USER', content: message, createdAt: new Date().toISOString() };
    set((s) => ({ aiMessages: [...s.aiMessages, userMsg] }));

    try {
      const { data } = await aiAPI.chat({
        projectId: currentProject?.id,
        message,
        history: aiMessages.slice(-10),
      });
      const assistantMsg: AIMessage = { id: (Date.now() + 1).toString(), role: 'ASSISTANT', content: data.message, createdAt: new Date().toISOString() };
      set((s) => ({ aiMessages: [...s.aiMessages, assistantMsg] }));
    } catch {
      const errMsg: AIMessage = { id: (Date.now() + 1).toString(), role: 'ASSISTANT', content: 'Erreur de communication avec l\'IA.', createdAt: new Date().toISOString() };
      set((s) => ({ aiMessages: [...s.aiMessages, errMsg] }));
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),
}));
