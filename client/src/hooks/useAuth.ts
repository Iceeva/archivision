import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export function useAuth(requireAuth: boolean = false) {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (requireAuth && !isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [requireAuth, isAuthenticated, isLoading]);

  return { user, isAuthenticated, isLoading };
}
