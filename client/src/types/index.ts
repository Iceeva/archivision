// ─── Types principaux ────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'USER' | 'ARCHITECT' | 'ADMIN';
  plan: Plan;
  createdAt: string;
}

export type Plan = 'FREE' | 'PRO' | 'ARCHITECT' | 'ENTERPRISE';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  ownerId: string;
  country: string;
  isPublic: boolean;
  isFavorite: boolean;
  terrain: TerrainConfig;
  house: HouseConfig;
  freeDescription?: string;
  plans?: GeneratedPlan[];
  activePlan?: string;
  model3D?: any;
  materials?: MaterialEstimate[];
  budget?: BudgetEstimate[];
  createdAt: string;
  updatedAt: string;
  _count?: { versions: number; collaborations: number };
}

export type ProjectStatus = 'DRAFT' | 'GENERATING' | 'READY' | 'MODIFIED' | 'ARCHIVED';

export interface TerrainConfig {
  length?: number;
  width?: number;
  area?: number;
  orientation?: string;
  type?: TerrainType;
}

export type TerrainType = 'FLAT' | 'SLOPE' | 'ANGLE' | 'IRREGULAR';

export interface HouseConfig {
  houseType?: HouseType;
  floors?: number;
  bedrooms?: number;
  livingRooms?: number;
  kitchens?: number;
  bathrooms?: number;
  hasGarage?: boolean;
  hasPool?: boolean;
  hasTerrace?: boolean;
  hasBalcony?: boolean;
  hasGarden?: boolean;
}

export type HouseType = 'VILLA' | 'DUPLEX' | 'TRIPLEX' | 'BUILDING' | 'RESIDENCE' | 'MODERN' | 'LUXURY' | 'TRADITIONAL' | 'BUNGALOW';

export interface PlanRoom {
  id: string;
  name: string;
  type: string;
  width: number;
  length: number;
  x: number;
  y: number;
  floor: number;
  area: number;
}

export interface GeneratedPlan {
  id: string;
  name: string;
  description: string;
  rooms: PlanRoom[];
  walls: { x1: number; y1: number; x2: number; y2: number; thickness: number }[];
  doors: { x: number; y: number; width: number; rotation: number }[];
  windows: { x: number; y: number; width: number; wall: string }[];
  dimensions: {
    totalArea: number;
    builtArea: number;
    floors: number;
    height: number;
  };
  style: string;
}

export interface MaterialEstimate {
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

export interface BudgetEstimate {
  level: string;
  label: string;
  totalCost: number;
  costPerM2: number;
  currency: string;
  materials: MaterialEstimate[];
  laborCost: number;
  overhead: number;
}

export interface AIMessage {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  createdAt: string;
}

export interface Collaboration {
  id: string;
  projectId: string;
  userId: string;
  role: 'VIEWER' | 'EDITOR' | 'ADMIN';
  user?: User;
}

export interface Comment {
  id: string;
  content: string;
  x?: number;
  y?: number;
  resolved: boolean;
  user?: User;
  createdAt: string;
}
