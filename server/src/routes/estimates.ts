import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { calculateMaterials, calculateBudget } from '../services/estimator';

const router = Router();
const prisma = new PrismaClient();

// ─── Estimation matériaux ────────────────────────────────
router.post('/materials', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, builtArea, floors, bedrooms, bathrooms, hasGarage, hasPool, hasTerrace, country } = req.body;

    const materials = calculateMaterials({
      builtArea: builtArea || 100,
      floors: floors || 1,
      bedrooms: bedrooms || 3,
      bathrooms: bathrooms || 1,
      hasGarage: hasGarage || false,
      hasPool: hasPool || false,
      hasTerrace: hasTerrace || false,
      country: country || 'FR',
    });

    if (projectId) {
      await prisma.project.update({
        where: { id: projectId },
        data: { materials: materials as any },
      });
    }

    res.json({ materials });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Estimation budget ───────────────────────────────────
router.post('/budget', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const budget = calculateBudget(req.body);

    if (req.body.projectId) {
      await prisma.project.update({
        where: { id: req.body.projectId },
        data: { budget: budget as any },
      });
    }

    res.json({ budget });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
