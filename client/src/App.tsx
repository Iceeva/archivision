import { Suspense } from 'react';
import AppRoutes from '@/routes';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-400 to-emerald-500 flex items-center justify-center animate-pulse-slow">
          <span className="text-2xl font-bold">A</span>
        </div>
        <p className="text-dark-200 text-sm">Chargement...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AppRoutes />
    </Suspense>
  );
}
