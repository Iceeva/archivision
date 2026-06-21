import { callAI } from './aiService';

interface TerrainInfo {
  length?: number;
  width?: number;
  area?: number;
  orientation?: string;
  type?: string;
}

interface HouseInfo {
  houseType?: string;
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

interface PlanRoom {
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

interface GeneratedPlan {
  id: string;
  name: string;
  description: string;
  rooms: PlanRoom[];
  walls: any[];
  doors: any[];
  windows: any[];
  dimensions: {
    totalArea: number;
    builtArea: number;
    floors: number;
    height: number;
  };
  style: string;
  facade: { front: string; back: string; left: string; right: string };
}

// ─── Générer des plans IA ────────────────────────────────
export async function generatePlans(
  terrain: TerrainInfo,
  house: HouseInfo,
  freeDescription?: string
): Promise<GeneratedPlan[]> {
  const prompt = buildPlanPrompt(terrain, house, freeDescription);

  const response = await callAI([{ role: 'user', content: prompt }]);

  try {
    // Parser le JSON de la réponse IA
    const jsonMatch = response.content.match(/```json\n([\s\S]*?)\n```/) ||
                      response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      return Array.isArray(parsed) ? parsed : [parsed];
    }
  } catch (e) {
    console.error('[PlanGenerator] Erreur parsing JSON:', e);
  }

  // Fallback : génération procédurale
  return generateProceduralPlans(terrain, house);
}

// ─── Modifier un plan via IA ─────────────────────────────
export async function modifyPlan(
  currentPlan: GeneratedPlan,
  instruction: string
): Promise<GeneratedPlan> {
  const prompt = `Voici le plan actuel en JSON:
\`\`\`json
${JSON.stringify(currentPlan, null, 2)}
\`\`\`

Instruction de modification: "${instruction}"

Applique UNIQUEMENT les modifications demandées et retourne le plan modifié complet en JSON.
Conserve toutes les pièces et dimensions non mentionnées.`;

  const response = await callAI([{ role: 'user', content: prompt }]);

  try {
    const jsonMatch = response.content.match(/```json\n([\s\S]*?)\n```/) ||
                      response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }
  } catch {}

  return currentPlan;
}

// ─── Construire le prompt ────────────────────────────────
function buildPlanPrompt(terrain: TerrainInfo, house: HouseInfo, description?: string): string {
  const terrainL = terrain.length || 20;
  const terrainW = terrain.width || 15;

  let prompt = `Génère 4 propositions de plans architecturaux (Plan A, B, C, D) au format JSON.

TERRAIN:
- Dimensions: ${terrainL}m x ${terrainW}m = ${terrainL * terrainW}m²
- Orientation: ${terrain.orientation || 'Nord-Sud'}
- Type: ${terrain.type || 'Plat'}

MAISON:
- Type: ${house.houseType || 'Moderne'}
- Étages: ${house.floors || 1}
- Chambres: ${house.bedrooms || 'auto'}
- Salons: ${house.livingRooms || 'auto'}
- Cuisines: ${house.kitchens || 'auto'}
- Salles de bain: ${house.bathrooms || 'auto'}
- Garage: ${house.hasGarage ? 'Oui' : 'Non'}
- Piscine: ${house.hasPool ? 'Oui' : 'Non'}
- Terrasse: ${house.hasTerrace ? 'Oui' : 'Non'}
- Balcon: ${house.hasBalcony ? 'Oui' : 'Non'}
- Jardin: ${house.hasGarden ? 'Oui' : 'Non'}`;

  if (description) {
    prompt += `\n\nDESCRIPTION LIBRE: "${description}"`;
  }

  prompt += `\n\nRetourne un tableau JSON de 4 plans. Chaque plan doit avoir:
{
  "id": "plan_a",
  "name": "Plan A - [Style]",
  "description": "Description courte",
  "rooms": [{"id":"r1","name":"Salon","type":"living","width":6,"length":5,"x":0,"y":0,"floor":0,"area":30}],
  "walls": [{"x1":0,"y1":0,"x2":6,"y2":0,"thickness":0.2}],
  "doors": [{"x":3,"y":0,"width":0.9,"rotation":0}],
  "windows": [{"x":2,"y":0,"width":1.2,"wall":"north"}],
  "dimensions": {"totalArea":150,"builtArea":120,"floors":1,"height":3},
  "style": "moderne minimaliste"
}

Fais des plans réalistes et cohérents. Toutes les pièces doivent avoir des positions (x,y) correctes.`;

  return prompt;
}

// ─── Génération procédurale (fallback) ───────────────────
function generateProceduralPlans(terrain: TerrainInfo, house: HouseInfo): GeneratedPlan[] {
  const L = terrain.length || 20;
  const W = terrain.width || 15;
  const floors = house.floors || 1;
  const bedrooms = house.bedrooms || Math.max(2, Math.floor((L * W) / 40));
  const bathrooms = house.bathrooms || Math.max(1, Math.ceil(bedrooms / 2));

  const styles = [
    { id: 'plan_a', name: 'Plan A — Moderne Ouvert', style: 'moderne minimaliste' },
    { id: 'plan_b', name: 'Plan B — Classique Fonctionnel', style: 'classique fonctionnel' },
    { id: 'plan_c', name: 'Plan C — Luxe Spacieux', style: 'luxe contemporain' },
    { id: 'plan_d', name: 'Plan D — Compact Optimisé', style: 'compact optimisé' },
  ];

  const maxBuiltWidth = Math.min(W - 2, W * 0.8);
  const maxBuiltLength = Math.min(L - 2, L * 0.8);

  return styles.map((s, idx) => {
    const rooms: PlanRoom[] = [];
    const scaleFactor = [1, 0.95, 1.1, 0.85][idx];
    let currentX = 1;
    let currentY = 1;

    // Salon
    const livingW = Math.round(Math.min(6, maxBuiltWidth * 0.4) * scaleFactor * 10) / 10;
    const livingL = Math.round(Math.min(5, maxBuiltLength * 0.35) * scaleFactor * 10) / 10;
    rooms.push({ id: `${s.id}_living`, name: 'Salon', type: 'living', width: livingW, length: livingL, x: currentX, y: currentY, floor: 0, area: +(livingW * livingL).toFixed(1) });

    // Cuisine
    const kitW = Math.round(Math.min(4.5, maxBuiltWidth * 0.3) * scaleFactor * 10) / 10;
    const kitL = Math.round(Math.min(3.5, maxBuiltLength * 0.25) * scaleFactor * 10) / 10;
    rooms.push({ id: `${s.id}_kitchen`, name: 'Cuisine', type: 'kitchen', width: kitW, length: kitL, x: currentX + livingW + 0.2, y: currentY, floor: 0, area: +(kitW * kitL).toFixed(1) });

    // Chambres
    for (let b = 0; b < bedrooms; b++) {
      const bFloor = b >= Math.ceil(bedrooms / floors) ? 1 : 0;
      const bW = Math.round(Math.min(4, maxBuiltWidth * 0.25) * scaleFactor * 10) / 10;
      const bL = Math.round(Math.min(4, maxBuiltLength * 0.25) * scaleFactor * 10) / 10;
      const bX = currentX + (b % 3) * (bW + 0.2);
      const bY = currentY + livingL + 0.2 + Math.floor(b / 3) * (bL + 0.2);
      rooms.push({ id: `${s.id}_bed${b}`, name: `Chambre ${b + 1}`, type: 'bedroom', width: bW, length: bL, x: bX, y: bY, floor: bFloor, area: +(bW * bL).toFixed(1) });
    }

    // Salles de bain
    for (let bt = 0; bt < bathrooms; bt++) {
      const btW = 2.5, btL = 2;
      rooms.push({ id: `${s.id}_bath${bt}`, name: `Salle de bain ${bt + 1}`, type: 'bathroom', width: btW, length: btL, x: currentX + bt * 3, y: currentY + livingL + 4.5, floor: bt >= 1 ? 1 : 0, area: btW * btL });
    }

    // Entrée
    rooms.push({ id: `${s.id}_entry`, name: 'Entrée', type: 'entry', width: 2, length: 2, x: currentX, y: currentY + livingL + 0.2, floor: 0, area: 4 });

    // Garage
    if (house.hasGarage) {
      rooms.push({ id: `${s.id}_garage`, name: 'Garage', type: 'garage', width: 5, length: 6, x: currentX + maxBuiltWidth - 5, y: currentY, floor: 0, area: 30 });
    }

    const builtArea = rooms.filter(r => r.floor === 0).reduce((sum, r) => sum + r.area, 0);

    return {
      id: s.id,
      name: s.name,
      description: `Conception ${s.style} — ${bedrooms} chambres, ${bathrooms} SdB, ${floors} étage(s)`,
      rooms,
      walls: generateWalls(rooms),
      doors: rooms.map(r => ({ x: r.x + r.width / 2, y: r.y, width: 0.9, rotation: 0 })),
      windows: rooms.filter(r => ['living', 'bedroom', 'kitchen'].includes(r.type))
        .map(r => ({ x: r.x + r.width / 2, y: r.y, width: 1.2, wall: 'south' })),
      dimensions: {
        totalArea: L * W,
        builtArea: Math.round(builtArea),
        floors,
        height: floors * 3,
      },
      style: s.style,
      facade: { front: 'Façade moderne', back: 'Façade arrière', left: 'Vue latérale G', right: 'Vue latérale D' },
    };
  });
}

function generateWalls(rooms: PlanRoom[]): any[] {
  return rooms.flatMap(r => [
    { x1: r.x, y1: r.y, x2: r.x + r.width, y2: r.y, thickness: 0.2 },
    { x1: r.x + r.width, y1: r.y, x2: r.x + r.width, y2: r.y + r.length, thickness: 0.2 },
    { x1: r.x, y1: r.y + r.length, x2: r.x + r.width, y2: r.y + r.length, thickness: 0.2 },
    { x1: r.x, y1: r.y, x2: r.x, y2: r.y + r.length, thickness: 0.2 },
  ]);
}
