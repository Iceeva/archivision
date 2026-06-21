import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  const localeMap: Record<string, string> = {
    EUR: 'fr-FR', XOF: 'fr-FR', USD: 'en-US', CAD: 'en-CA',
  };
  return new Intl.NumberFormat(localeMap[currency] || 'fr-FR', {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

export function formatArea(m2: number): string {
  return `${m2.toLocaleString('fr-FR')} m²`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function formatRelative(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days}j`;
  return formatDate(date);
}

export const HOUSE_TYPE_LABELS: Record<string, string> = {
  VILLA: 'Villa', DUPLEX: 'Duplex', TRIPLEX: 'Triplex', BUILDING: 'Immeuble',
  RESIDENCE: 'Résidence', MODERN: 'Maison Moderne', LUXURY: 'Maison de Luxe',
  TRADITIONAL: 'Maison Traditionnelle', BUNGALOW: 'Bungalow',
};

export const TERRAIN_TYPE_LABELS: Record<string, string> = {
  FLAT: 'Plat', SLOPE: 'Pente', ANGLE: 'Angle', IRREGULAR: 'Irrégulier',
};

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Brouillon', color: 'badge-yellow' },
  GENERATING: { label: 'Génération...', color: 'badge-blue' },
  READY: { label: 'Prêt', color: 'badge-green' },
  MODIFIED: { label: 'Modifié', color: 'badge-blue' },
  ARCHIVED: { label: 'Archivé', color: 'badge-red' },
};

export const COUNTRY_OPTIONS = [
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸' },
];
