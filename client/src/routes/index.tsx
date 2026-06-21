import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProjectEditorPage = lazy(() => import('@/pages/ProjectEditorPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/project/:id" element={<ProjectEditorPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
