import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// ─── Statistiques globales ───────────────────────────────
router.get('/stats', authenticate, requireRole('ADMIN'), async (_req: AuthRequest, res: Response) => {
  const [userCount, projectCount, activeProjects, recentActivities] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.project.count({ where: { status: { in: ['READY', 'MODIFIED', 'GENERATING'] } } }),
    prisma.activity.findMany({ orderBy: { createdAt: 'desc' }, take: 20, include: { user: { select: { name: true, email: true } } } }),
  ]);

  const planCounts = await prisma.user.groupBy({ by: ['plan'], _count: true });

  res.json({
    users: { total: userCount, byPlan: planCounts },
    projects: { total: projectCount, active: activeProjects },
    recentActivities,
  });
});

// ─── Liste des utilisateurs ──────────────────────────────
router.get('/users', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip, take: limit, orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, role: true, plan: true, isActive: true, createdAt: true,
        _count: { select: { projects: true } } },
    }),
    prisma.user.count(),
  ]);

  res.json({ users, total, page, pages: Math.ceil(total / limit) });
});

// ─── Modifier un utilisateur ─────────────────────────────
router.patch('/users/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  const { role, plan, isActive } = req.body;
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { ...(role && { role }), ...(plan && { plan }), ...(isActive !== undefined && { isActive }) },
  });
  res.json(user);
});

// ─── Logs d'activité ─────────────────────────────────────
router.get('/activities', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 50;

  const activities = await prisma.activity.findMany({
    skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } }, project: { select: { name: true } } },
  });

  res.json(activities);
});

export default router;
