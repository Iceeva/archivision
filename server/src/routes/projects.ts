import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// ─── Tous les projets de l'utilisateur ───────────────────
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const projects = await prisma.project.findMany({
    where: { ownerId: req.userId },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { versions: true, collaborations: true } } },
  });
  res.json(projects);
});

// ─── Créer un projet ─────────────────────────────────────
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const project = await prisma.project.create({
      data: { ...req.body, ownerId: req.userId! },
    });

    await prisma.activity.create({
      data: { userId: req.userId!, projectId: project.id, action: 'PROJECT_CREATED', details: project.name },
    });

    res.status(201).json(project);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ─── Détail d'un projet ──────────────────────────────────
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, OR: [{ ownerId: req.userId }, { collaborations: { some: { userId: req.userId } } }] },
    include: {
      versions: { orderBy: { version: 'desc' }, take: 10 },
      collaborations: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
      comments: { include: { user: { select: { id: true, name: true, avatar: true } } }, orderBy: { createdAt: 'desc' } },
      aiMessages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!project) return res.status(404).json({ error: 'Projet introuvable' });
  res.json(project);
});

// ─── Mettre à jour un projet ─────────────────────────────
router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Sauvegarder version avant modification
    const existing = await prisma.project.findFirst({ where: { id: req.params.id, ownerId: req.userId } });
    if (!existing) return res.status(404).json({ error: 'Projet introuvable' });

    const versionCount = await prisma.projectVersion.count({ where: { projectId: existing.id } });
    await prisma.projectVersion.create({
      data: {
        projectId: existing.id,
        version: versionCount + 1,
        data: JSON.parse(JSON.stringify(existing)),
        label: `Auto-save v${versionCount + 1}`,
      },
    });

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { ...req.body, updatedAt: new Date() },
    });

    res.json(project);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ─── Supprimer un projet ─────────────────────────────────
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  await prisma.project.deleteMany({ where: { id: req.params.id, ownerId: req.userId } });
  res.json({ message: 'Projet supprimé' });
});

// ─── Dupliquer un projet ─────────────────────────────────
router.post('/:id/duplicate', authenticate, async (req: AuthRequest, res: Response) => {
  const original = await prisma.project.findFirst({ where: { id: req.params.id, ownerId: req.userId } });
  if (!original) return res.status(404).json({ error: 'Projet introuvable' });

  const { id, createdAt, updatedAt, ...data } = original;
  const duplicate = await prisma.project.create({
    data: { ...data, name: `${original.name} (copie)`, ownerId: req.userId! },
  });

  res.status(201).json(duplicate);
});

// ─── Toggle favori ───────────────────────────────────────
router.post('/:id/favorite', authenticate, async (req: AuthRequest, res: Response) => {
  const project = await prisma.project.findFirst({ where: { id: req.params.id, ownerId: req.userId } });
  if (!project) return res.status(404).json({ error: 'Projet introuvable' });

  const updated = await prisma.project.update({
    where: { id: project.id },
    data: { isFavorite: !project.isFavorite },
  });

  res.json(updated);
});

// ─── Restaurer une version ───────────────────────────────
router.post('/:id/restore/:versionId', authenticate, async (req: AuthRequest, res: Response) => {
  const version = await prisma.projectVersion.findFirst({
    where: { id: req.params.versionId, projectId: req.params.id },
  });
  if (!version) return res.status(404).json({ error: 'Version introuvable' });

  const versionData = version.data as any;
  const { id, createdAt, updatedAt, ownerId, ...restoreData } = versionData;

  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: { ...restoreData, status: 'MODIFIED' },
  });

  res.json(project);
});

// ─── Ajouter un collaborateur ────────────────────────────
router.post('/:id/collaborators', authenticate, async (req: AuthRequest, res: Response) => {
  const { email, role = 'VIEWER' } = req.body;
  const project = await prisma.project.findFirst({ where: { id: req.params.id, ownerId: req.userId } });
  if (!project) return res.status(404).json({ error: 'Projet introuvable' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

  const collab = await prisma.collaboration.create({
    data: { projectId: project.id, userId: user.id, role },
  });

  res.status(201).json(collab);
});

// ─── Ajouter un commentaire ──────────────────────────────
router.post('/:id/comments', authenticate, async (req: AuthRequest, res: Response) => {
  const comment = await prisma.comment.create({
    data: { projectId: req.params.id, userId: req.userId!, ...req.body },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });
  res.status(201).json(comment);
});

export default router;
