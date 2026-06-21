import { useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';

export function useProject(id?: string) {
  const store = useProjectStore();

  useEffect(() => {
    if (id) store.fetchProject(id);
  }, [id]);

  return store;
}

export function useProjects() {
  const { projects, isLoading, fetchProjects, deleteProject, duplicateProject, toggleFavorite } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, isLoading, fetchProjects, deleteProject, duplicateProject, toggleFavorite };
}
