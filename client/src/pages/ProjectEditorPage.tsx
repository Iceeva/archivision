import { useParams } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import EditorLayout from '@/components/editor/EditorLayout';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/hooks/useProject';

export default function ProjectEditorPage() {
  useAuth(true);
  const { id } = useParams<{ id: string }>();
  const { currentProject } = useProject(id);

  return (
    <AppShell title={currentProject?.name || 'Éditeur'}>
      <EditorLayout />
    </AppShell>
  );
}
