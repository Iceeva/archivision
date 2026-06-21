import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimiter';
import { callAI, streamAI } from '../services/aiService';
import { generatePlans, modifyPlan } from '../services/planGenerator';

const router = Router();
const prisma = new PrismaClient();

// ─── Générer des plans IA ────────────────────────────────
router.post('/generate-plans', authenticate, aiLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, terrain, house, freeDescription } = req.body;

    // Mettre à jour le status du projet
    if (projectId) {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'GENERATING' },
      });
    }

    const plans = await generatePlans(terrain || {}, house || {}, freeDescription);

    // Sauvegarder les plans dans le projet
    if (projectId) {
      await prisma.project.update({
        where: { id: projectId },
        data: { plans: plans as any, activePlan: plans[0]?.id, status: 'READY' },
      });

      // Sauvegarder le message IA
      await prisma.aIMessage.create({
        data: {
          projectId,
          role: 'ASSISTANT',
          content: `J'ai généré ${plans.length} propositions de plans pour votre projet.`,
          metadata: { plansCount: plans.length } as any,
        },
      });
    }

    res.json({ plans });
  } catch (err: any) {
    console.error('[AI] Erreur génération plans:', err.message);
    res.status(500).json({ error: 'Erreur lors de la génération des plans' });
  }
});

// ─── Modifier un plan via instruction IA ─────────────────
router.post('/modify-plan', authenticate, aiLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, plan, instruction } = req.body;

    // Sauvegarder le message utilisateur
    if (projectId) {
      await prisma.aIMessage.create({
        data: { projectId, role: 'USER', content: instruction },
      });
    }

    const modifiedPlan = await modifyPlan(plan, instruction);

    // Sauvegarder la modification
    if (projectId) {
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      const plans = (project?.plans as any[]) || [];
      const planIndex = plans.findIndex((p: any) => p.id === plan.id);
      if (planIndex >= 0) {
        plans[planIndex] = modifiedPlan;
        await prisma.project.update({
          where: { id: projectId },
          data: { plans: plans as any, status: 'MODIFIED' },
        });
      }

      await prisma.aIMessage.create({
        data: {
          projectId,
          role: 'ASSISTANT',
          content: `Modification appliquée: "${instruction}"`,
          metadata: { modification: instruction } as any,
        },
      });
    }

    res.json({ plan: modifiedPlan });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Chat conversationnel IA ─────────────────────────────
router.post('/chat', authenticate, aiLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, message, history } = req.body;

    if (projectId) {
      await prisma.aIMessage.create({
        data: { projectId, role: 'USER', content: message },
      });
    }

    const messages = [
      ...(history || []).map((m: any) => ({ role: m.role.toLowerCase(), content: m.content })),
      { role: 'user', content: message },
    ];

    const response = await callAI(messages);

    if (projectId) {
      await prisma.aIMessage.create({
        data: { projectId, role: 'ASSISTANT', content: response.content },
      });
    }

    res.json({ message: response.content, tokensUsed: response.tokensUsed });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Streaming chat ──────────────────────────────────────
router.post('/chat/stream', authenticate, aiLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const messages = [
      ...(history || []).map((m: any) => ({ role: m.role.toLowerCase(), content: m.content })),
      { role: 'user', content: message },
    ];

    await streamAI(messages, (chunk) => {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    });

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

export default router;
