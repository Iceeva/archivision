import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { config } from '../config';
import { authenticate, AuthRequest } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();
const prisma = new PrismaClient();

// ─── Inscription ─────────────────────────────────────────
router.post('/register', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, mot de passe et nom requis' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email déjà utilisé' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const tokens = generateTokens(user.id, user.role);
    await saveRefreshToken(user.id, tokens.refreshToken);

    res.status(201).json({ user: sanitizeUser(user), ...tokens });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Connexion ───────────────────────────────────────────
router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return res.status(401).json({ error: 'Identifiants invalides' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Identifiants invalides' });

    const tokens = generateTokens(user.id, user.role);
    await saveRefreshToken(user.id, tokens.refreshToken);

    res.json({ user: sanitizeUser(user), ...tokens });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Refresh Token ───────────────────────────────────────
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token requis' });

    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string };
    const session = await prisma.session.findUnique({ where: { refreshToken } });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Session expirée' });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable' });

    await prisma.session.delete({ where: { id: session.id } });
    const tokens = generateTokens(user.id, user.role);
    await saveRefreshToken(user.id, tokens.refreshToken);

    res.json(tokens);
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// ─── Profil ──────────────────────────────────────────────
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json(sanitizeUser(user));
});

// ─── Déconnexion ─────────────────────────────────────────
router.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
  await prisma.session.deleteMany({ where: { userId: req.userId } });
  res.json({ message: 'Déconnecté' });
});

// ─── Helpers ─────────────────────────────────────────────
function generateTokens(userId: string, role: string) {
  const accessToken = jwt.sign({ userId, role }, config.jwt.secret, { expiresIn: config.jwt.accessExpiry });
  const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiry });
  return { accessToken, refreshToken };
}

async function saveRefreshToken(userId: string, token: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { userId, refreshToken: token, expiresAt } });
}

function sanitizeUser(user: any) {
  const { password, ...safe } = user;
  return safe;
}

export default router;
