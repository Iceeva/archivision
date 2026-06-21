import { MessageSquare, Lightbulb } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';

const SUGGESTIONS = [
  'Je veux une maison moderne avec beaucoup de lumière naturelle.',
  'Je veux quelque chose de luxueux avec de grandes baies vitrées.',
  'Je veux une maison familiale chaleureuse et fonctionnelle.',
  'Je veux un style minimaliste avec des espaces ouverts.',
  'Je veux une maison écologique avec des matériaux durables.',
  'Je veux un toit plat avec une terrasse sur le toit.',
];

export default function DescriptionStep() {
  const { freeDescription, setFreeDescription } = useProjectStore();

  return (
    <div className="space-y-6">
      <p className="text-sm text-dark-200">
        <span className="badge-blue mr-2">Facultatif</span>
        Décrivez librement votre vision. L'IA analysera vos préférences pour générer des plans adaptés.
      </p>

      {/* Zone conversationnelle */}
      <div>
        <label className="label flex items-center gap-2">
          <MessageSquare size={12} /> Votre vision
        </label>
        <textarea
          value={freeDescription}
          onChange={e => setFreeDescription(e.target.value)}
          rows={5}
          className="input resize-none"
          placeholder="Décrivez la maison de vos rêves... (ex: Je veux une maison moderne avec 4 chambres, un grand salon ouvert sur la cuisine, beaucoup de lumière naturelle et une piscine dans le jardin)"
        />
        <p className="text-[11px] text-dark-300 mt-1">{freeDescription.length} caractères</p>
      </div>

      {/* Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={14} className="text-yellow-400" />
          <span className="text-xs font-medium text-dark-200">Suggestions</span>
        </div>
        <div className="space-y-2">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => setFreeDescription(freeDescription ? `${freeDescription}\n${s}` : s)}
              className="block w-full text-left px-4 py-2.5 rounded-xl bg-dark-700 border border-dark-500
                text-xs text-dark-200 hover:border-brand-500/50 hover:text-brand-400 transition-all"
            >
              "{s}"
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="bg-dark-700/50 rounded-xl p-4 border border-dark-500/30">
        <p className="text-xs text-dark-300">
          💡 <strong className="text-dark-100">Astuce :</strong> Même sans description, l'IA générera
          automatiquement 4 propositions de plans cohérentes basées sur les dimensions et le type de maison.
        </p>
      </div>
    </div>
  );
}
