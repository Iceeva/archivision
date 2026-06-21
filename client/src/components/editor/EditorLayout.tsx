import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { useProjectStore } from '@/store/projectStore';
import FloorPlanView from './FloorPlanView';
import Scene3D from '../viewer/Scene3D';
import VirtualTour from '../viewer/VirtualTour';
import ToolBar from './ToolBar';
import AIChatPanel from './AIChatPanel';
import PlanSelector from '../project/PlanSelector';
import MaterialEstimate from '../estimates/MaterialEstimate';
import BudgetEstimate from '../estimates/BudgetEstimate';
import ExportPanel from '../export/ExportPanel';
import CollabPanel from '../collab/CollabPanel';
import { cn } from '@/lib/utils';
import { MessageSquare, Users, Download, Calculator, X, ChevronRight } from 'lucide-react';

export default function EditorLayout() {
  const { viewMode, rightPanelOpen, rightPanelTab, setRightPanelTab, toggleRightPanel } = useUIStore();
  const { plans, activePlan, selectPlan, isGenerating } = useProjectStore();

  const rightTabs = [
    { id: 'ai' as const, icon: MessageSquare, label: 'IA' },
    { id: 'estimate' as const, icon: Calculator, label: 'Devis' },
    { id: 'export' as const, icon: Download, label: 'Export' },
    { id: 'collab' as const, icon: Users, label: 'Collab' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Plan Selector */}
      {plans.length > 0 && (
        <div className="px-4 py-3 border-b border-dark-500/30 bg-dark-800/50">
          <PlanSelector plans={plans} activePlan={activePlan} onSelect={selectPlan} />
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Toolbar */}
        <ToolBar />

        {/* Main View */}
        <div className="flex-1 relative overflow-hidden bg-dark-900">
          {isGenerating ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-brand-400 to-emerald-500 flex items-center justify-center animate-pulse-slow">
                  <span className="text-3xl">🏗️</span>
                </div>
                <p className="text-dark-200">Génération du plan en cours...</p>
                <div className="w-48 h-1 bg-dark-600 rounded-full overflow-hidden mx-auto">
                  <motion.div className="h-full bg-brand-500 rounded-full"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity }} />
                </div>
              </div>
            </div>
          ) : !activePlan ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-dark-300">Aucun plan sélectionné</p>
              </div>
            </div>
          ) : viewMode === '2d' ? (
            <FloorPlanView plan={activePlan} />
          ) : viewMode === '3d' ? (
            <Scene3D plan={activePlan} />
          ) : (
            <VirtualTour plan={activePlan} />
          )}
        </div>

        {/* Right Panel Toggle */}
        {!rightPanelOpen && (
          <div className="flex flex-col gap-1 p-1 bg-dark-800 border-l border-dark-500/30">
            {rightTabs.map(tab => (
              <button key={tab.id} onClick={() => setRightPanelTab(tab.id)}
                className="p-2 rounded-lg hover:bg-dark-600 text-dark-300 hover:text-white"
                title={tab.label}>
                <tab.icon size={16} />
              </button>
            ))}
          </div>
        )}

        {/* Right Panel */}
        {rightPanelOpen && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 380 }}
            className="h-full bg-dark-800 border-l border-dark-500/30 flex flex-col overflow-hidden"
          >
            {/* Tabs */}
            <div className="flex items-center border-b border-dark-500/30">
              {rightTabs.map(tab => (
                <button key={tab.id} onClick={() => setRightPanelTab(tab.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all border-b-2',
                    rightPanelTab === tab.id
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-dark-300 hover:text-white'
                  )}>
                  <tab.icon size={13} /> {tab.label}
                </button>
              ))}
              <button onClick={toggleRightPanel} className="p-2 mr-1 rounded-lg hover:bg-dark-600 text-dark-300">
                <X size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {rightPanelTab === 'ai' && <AIChatPanel />}
              {rightPanelTab === 'estimate' && (
                <div className="p-4 space-y-6">
                  <MaterialEstimate />
                  <BudgetEstimate />
                </div>
              )}
              {rightPanelTab === 'export' && <ExportPanel />}
              {rightPanelTab === 'collab' && <CollabPanel />}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
