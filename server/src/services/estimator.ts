import { MATERIAL_PRICES, BUDGET_MULTIPLIERS, COUNTRY_MAP, EXCHANGE_RATES } from '../utils/materialPrices';

interface EstimateInput {
  builtArea: number;      // Surface construite m²
  floors: number;
  bedrooms: number;
  bathrooms: number;
  hasGarage: boolean;
  hasPool: boolean;
  hasTerrace: boolean;
  country: string;        // Code pays (BJ, FR, etc.)
}

interface MaterialEstimate {
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

interface BudgetEstimate {
  level: string;
  label: string;
  totalCost: number;
  costPerM2: number;
  currency: string;
  materials: MaterialEstimate[];
  laborCost: number;
  overhead: number;
}

// ─── Calcul des quantités de matériaux ───────────────────
export function calculateMaterials(input: EstimateInput): MaterialEstimate[] {
  const { builtArea, floors, bedrooms, bathrooms, hasGarage, hasPool, country } = input;
  const totalArea = builtArea * floors;
  const perimeter = Math.sqrt(builtArea) * 4; // Approximation
  const wallArea = perimeter * 3 * floors; // Hauteur 3m par étage

  const estimates: MaterialEstimate[] = [];

  // ─── Fondations & Structure ────────────────
  // Ciment: ~10 sacs/m² de construction
  const cimentQty = Math.ceil(totalArea * 10);
  estimates.push(mat('Ciment (sac 50kg)', 'sac', cimentQty, country, 'Fondations & Structure'));

  // Sable: ~0.5 m³/m²
  const sableQty = Math.ceil(totalArea * 0.5);
  estimates.push(mat('Sable (m³)', 'm³', sableQty, country, 'Fondations & Structure'));

  // Gravier: ~0.3 m³/m²
  const gravierQty = Math.ceil(totalArea * 0.3);
  estimates.push(mat('Gravier (m³)', 'm³', gravierQty, country, 'Fondations & Structure'));

  // Fer: ~3 barres/m²
  const ferQty = Math.ceil(totalArea * 3);
  estimates.push(mat('Fer (barre 12mm, 12m)', 'barre', ferQty, country, 'Fondations & Structure'));

  // ─── Murs ──────────────────────────────────
  // Parpaings: ~13 par m² de mur
  const parpaingQty = Math.ceil(wallArea * 13);
  estimates.push(mat('Parpaings (20x20x40)', 'pcs', parpaingQty, country, 'Murs'));

  // Briques (cloisons intérieures): ~5/m² de surface habitable
  const briqueQty = Math.ceil(totalArea * 5);
  estimates.push(mat('Briques (unité)', 'pcs', briqueQty, country, 'Murs'));

  // ─── Revêtements ──────────────────────────
  // Carrelage: surface totale habitable
  estimates.push(mat('Carrelage (m²)', 'm²', Math.ceil(totalArea * 1.1), country, 'Revêtements'));

  // Peinture: murs intérieurs + extérieurs (~0.15 seau/m²)
  const peintureQty = Math.ceil((wallArea + totalArea * 0.5) * 0.15);
  estimates.push(mat('Peinture (seau 20L)', 'seau', peintureQty, country, 'Revêtements'));

  // ─── Menuiserie ────────────────────────────
  // Aluminium: fenêtres + portes
  const aluQty = Math.ceil((bedrooms + bathrooms + 3) * 4);
  estimates.push(mat('Aluminium (m linéaire)', 'ml', aluQty, country, 'Menuiserie'));

  // Vitres
  const vitreQty = Math.ceil((bedrooms + 3) * 2);
  estimates.push(mat('Vitres (m²)', 'm²', vitreQty, country, 'Menuiserie'));

  // Bois
  const boisQty = Math.ceil(totalArea * 0.03);
  estimates.push(mat('Bois (madrier m³)', 'm³', Math.max(1, boisQty), country, 'Menuiserie'));

  // ─── Technique ─────────────────────────────
  // Plomberie: 1 point par SdB + cuisine + WC
  const plombQty = bathrooms * 3 + 2;
  estimates.push(mat('Plomberie (forfait point)', 'point', plombQty, country, 'Technique'));

  // Électricité: ~2 points par pièce
  const elecQty = (bedrooms + bathrooms + 3) * 2;
  estimates.push(mat('Électricité (forfait point)', 'point', elecQty, country, 'Technique'));

  // ─── Toiture ───────────────────────────────
  estimates.push(mat('Tôle (m²)', 'm²', Math.ceil(builtArea * 1.15), country, 'Toiture'));

  return estimates;
}

// ─── Estimation budgétaire par niveau ────────────────────
export function calculateBudget(input: EstimateInput): BudgetEstimate[] {
  const materials = calculateMaterials(input);
  const baseMaterialCost = materials.reduce((sum, m) => sum + m.totalPrice, 0);
  const countryInfo = COUNTRY_MAP[input.country] || COUNTRY_MAP['FR'];

  return Object.entries(BUDGET_MULTIPLIERS).map(([level, { label, multiplier }]) => {
    const adjustedMaterials = materials.map(m => ({
      ...m,
      unitPrice: Math.round(m.unitPrice * multiplier * 100) / 100,
      totalPrice: Math.round(m.totalPrice * multiplier),
    }));

    const materialTotal = adjustedMaterials.reduce((sum, m) => sum + m.totalPrice, 0);
    const laborCost = Math.round(materialTotal * 0.4 * multiplier); // Main d'œuvre ~40%
    const overhead = Math.round(materialTotal * 0.1); // Frais généraux ~10%
    const totalCost = materialTotal + laborCost + overhead;
    const totalArea = input.builtArea * input.floors;

    return {
      level,
      label,
      totalCost,
      costPerM2: Math.round(totalCost / totalArea),
      currency: countryInfo.currency,
      materials: adjustedMaterials,
      laborCost,
      overhead,
    };
  });
}

// ─── Helper ──────────────────────────────────────────────
function mat(name: string, unit: string, quantity: number, country: string, category: string): MaterialEstimate {
  const mp = MATERIAL_PRICES.find(m => m.name === name);
  const unitPrice = mp?.prices[country] || mp?.prices['FR'] || 10;
  return { name, unit, quantity, unitPrice, totalPrice: Math.round(quantity * unitPrice), category };
}
