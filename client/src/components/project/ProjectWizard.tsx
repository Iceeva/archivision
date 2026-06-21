import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import TerrainStep from './TerrainStep';
import HouseStep from './HouseStep';
import DescriptionStep from './DescriptionStep';
import toast from 'react-hot-toast';

interface Props { onClose: () => void; }

const STEPS = [
  { id: 0, title: 'Terrain', subtitle: 'Dimensions et type de terrain' },
  { id: 1, title: 'Maison', subtitle: 'Type et configuration' },
  { id: 2, title: 'Description', subtitle: 'Description libre (facultatif)' },
];

export default function ProjectWizard({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { createProject, generatePlans } = useProjectStore();
  const navigate = useNavigate();

  const handleCreate = async () => {
    const name = projectName.trim() || `Projet ${new Date().toLocaleDateString('fr-FR')}`;
    setIsCreating(true);
    try {
      const project = await createProject(name);
      toast.success('Projet créé ! Génération des plans en cours...');
      await generatePlans();
      navigate(`/project/${project.id}`);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur de création');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-dark-800 border border-dark-500/50 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 pt-6 pb-4 border-b border-dark-500/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Nouveau Projet</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-dark-600 text-dark-300">
              <X size={18} />
            </button>
          </div>

          {/* Project Name */}
          <input
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            placeholder="Nom du projet (optionnel)"
            className="input mb-4"
          />

          {/* Steps */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <button onClick={() => setStep(i)} className="wizard-step">
                  <div className={`wizard-step-dot ${i === step ? 'active' : i < step ? 'completed' : 'pending'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-medium">{s.title}</p>
                    <p className="text-[10px] text-dark-300">{s.subtitle}</p>
                  </div>
                </button>
                {i < STEPS.length - 1 && <div className="flex-1 h-px bg-dark-500 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="px-8 py-6 max-h-[50vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && <TerrainStep />}
              {step === 1 && <HouseStep />}
              {step === 2 && <DescriptionStep />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-dark-500/30 flex items-center justify-between">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : onClose()}
            className="btn-ghost flex items-center gap-2 text-sm"
          >
            <ArrowLeft size={14} /> {step > 0 ? 'Précédent' : 'Annuler'}
          </button>

          {step < 2 ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary flex items-center gap-2 text-sm">
              Suivant <ArrowRight size={14} />
            </button>
          ) : (
            <button onClick={handleCreate} disabled={isCreating}
              className="btn-primary flex items-center gap-2 text-sm">
              {isCreating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {isCreating ? 'Génération...' : 'Générer les Plans'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
