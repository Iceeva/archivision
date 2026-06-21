export const MATERIAL_CATEGORIES = [
  { id: 'foundations', name: 'Fondations & Structure', icon: '🏗️', color: 'text-orange-400' },
  { id: 'walls', name: 'Murs', icon: '🧱', color: 'text-red-400' },
  { id: 'finishes', name: 'Revêtements', icon: '🎨', color: 'text-purple-400' },
  { id: 'carpentry', name: 'Menuiserie', icon: '🪵', color: 'text-amber-400' },
  { id: 'technical', name: 'Technique', icon: '⚡', color: 'text-yellow-400' },
  { id: 'roofing', name: 'Toiture', icon: '🏠', color: 'text-blue-400' },
];

export const ROOM_TYPE_COLORS: Record<string, { bg: string; border: string; label: string }> = {
  living: { bg: '#E8F5E9', border: '#4CAF50', label: 'Salon' },
  bedroom: { bg: '#E3F2FD', border: '#2196F3', label: 'Chambre' },
  kitchen: { bg: '#FFF3E0', border: '#FF9800', label: 'Cuisine' },
  bathroom: { bg: '#E0F7FA', border: '#00BCD4', label: 'Salle de bain' },
  entry: { bg: '#F3E5F5', border: '#9C27B0', label: 'Entrée' },
  garage: { bg: '#ECEFF1', border: '#607D8B', label: 'Garage' },
  terrace: { bg: '#F1F8E9', border: '#8BC34A', label: 'Terrasse' },
  pool: { bg: '#E1F5FE', border: '#03A9F4', label: 'Piscine' },
  stairs: { bg: '#FBE9E7', border: '#FF5722', label: 'Escalier' },
};

export const SUBSCRIPTION_PLANS = [
  {
    id: 'FREE',
    name: 'Gratuit',
    price: 0,
    features: ['3 projets max', '2 générations IA/jour', 'Export PNG/PDF', 'Vue 2D'],
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: 19,
    popular: true,
    features: ['Projets illimités', '50 générations IA/jour', 'Tous les exports', 'Vue 3D + Visite virtuelle', 'Estimation matériaux', 'Support prioritaire'],
  },
  {
    id: 'ARCHITECT',
    name: 'Architecte',
    price: 49,
    features: ['Tout du plan Pro', 'Générations IA illimitées', 'Export DWG/DXF/IFC', 'Rendus photo-réalistes', 'Collaboration équipe', 'API accès'],
  },
  {
    id: 'ENTERPRISE',
    name: 'Entreprise',
    price: 149,
    features: ['Tout du plan Architecte', 'Multi-utilisateurs', 'Branding personnalisé', 'Intégration BIM', 'Support dédié', 'SLA garanti'],
  },
];
