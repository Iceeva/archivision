// ─── Prix des matériaux par pays (par unité) ─────────────
// Sources: estimations moyennes marché 2024-2025

export interface MaterialPrice {
  name: string;
  unit: string;
  prices: Record<string, number>; // pays → prix en devise locale (converti en EUR)
}

export const MATERIAL_PRICES: MaterialPrice[] = [
  // Gros œuvre
  { name: 'Ciment (sac 50kg)', unit: 'sac', prices: { BJ: 5.5, TG: 5.8, CI: 6.0, SN: 6.2, FR: 8.5, CA: 9.0, US: 10.0 } },
  { name: 'Sable (m³)', unit: 'm³', prices: { BJ: 15, TG: 14, CI: 16, SN: 18, FR: 35, CA: 40, US: 38 } },
  { name: 'Gravier (m³)', unit: 'm³', prices: { BJ: 22, TG: 20, CI: 24, SN: 25, FR: 45, CA: 50, US: 48 } },
  { name: 'Fer (barre 12mm, 12m)', unit: 'barre', prices: { BJ: 6, TG: 5.5, CI: 6.5, SN: 7, FR: 12, CA: 14, US: 13 } },
  { name: 'Briques (unité)', unit: 'pcs', prices: { BJ: 0.15, TG: 0.12, CI: 0.18, SN: 0.16, FR: 0.45, CA: 0.50, US: 0.48 } },
  { name: 'Parpaings (20x20x40)', unit: 'pcs', prices: { BJ: 0.6, TG: 0.55, CI: 0.65, SN: 0.7, FR: 1.5, CA: 1.8, US: 1.6 } },

  // Revêtements
  { name: 'Carrelage (m²)', unit: 'm²', prices: { BJ: 8, TG: 7, CI: 9, SN: 10, FR: 25, CA: 30, US: 28 } },
  { name: 'Marbre (m²)', unit: 'm²', prices: { BJ: 35, TG: 32, CI: 40, SN: 38, FR: 80, CA: 90, US: 85 } },
  { name: 'Peinture (seau 20L)', unit: 'seau', prices: { BJ: 25, TG: 22, CI: 28, SN: 30, FR: 65, CA: 70, US: 60 } },

  // Menuiserie
  { name: 'Bois (madrier m³)', unit: 'm³', prices: { BJ: 180, TG: 170, CI: 200, SN: 190, FR: 350, CA: 320, US: 300 } },
  { name: 'Aluminium (m linéaire)', unit: 'ml', prices: { BJ: 15, TG: 14, CI: 18, SN: 16, FR: 35, CA: 38, US: 36 } },
  { name: 'Vitres (m²)', unit: 'm²', prices: { BJ: 18, TG: 16, CI: 20, SN: 22, FR: 45, CA: 50, US: 48 } },

  // Technique
  { name: 'Plomberie (forfait point)', unit: 'point', prices: { BJ: 40, TG: 35, CI: 45, SN: 50, FR: 120, CA: 130, US: 140 } },
  { name: 'Électricité (forfait point)', unit: 'point', prices: { BJ: 25, TG: 22, CI: 28, SN: 30, FR: 80, CA: 85, US: 90 } },

  // Toiture
  { name: 'Tôle (m²)', unit: 'm²', prices: { BJ: 8, TG: 7.5, CI: 9, SN: 8.5, FR: 15, CA: 18, US: 16 } },
  { name: 'Tuiles (m²)', unit: 'm²', prices: { BJ: 15, TG: 14, CI: 18, SN: 16, FR: 35, CA: 40, US: 38 } },
];

export const COUNTRY_MAP: Record<string, { name: string; currency: string; code: string }> = {
  BJ: { name: 'Bénin', currency: 'XOF', code: 'BJ' },
  TG: { name: 'Togo', currency: 'XOF', code: 'TG' },
  CI: { name: 'Côte d\'Ivoire', currency: 'XOF', code: 'CI' },
  SN: { name: 'Sénégal', currency: 'XOF', code: 'SN' },
  FR: { name: 'France', currency: 'EUR', code: 'FR' },
  CA: { name: 'Canada', currency: 'CAD', code: 'CA' },
  US: { name: 'États-Unis', currency: 'USD', code: 'US' },
};

// Multiplicateurs pour niveaux de budget
export const BUDGET_MULTIPLIERS = {
  economic: { label: 'Économique', multiplier: 0.7 },
  standard: { label: 'Standard', multiplier: 1.0 },
  premium: { label: 'Premium', multiplier: 1.5 },
  luxury: { label: 'Luxe', multiplier: 2.2 },
};

// Taux de conversion vers EUR (approximatif)
export const EXCHANGE_RATES: Record<string, number> = {
  XOF: 0.00152,
  EUR: 1,
  CAD: 0.68,
  USD: 0.92,
};
