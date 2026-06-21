import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { apiLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import aiRoutes from './routes/ai';
import estimateRoutes from './routes/estimates';
import exportRoutes from './routes/exports';
import adminRoutes from './routes/admin';

const app = express();

// ─── Middleware Global ───────────────────────────────────
app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use('/api', apiLimiter);

// ─── Routes ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/estimates', estimateRoutes);
app.use('/api/exports', exportRoutes);
app.use('/api/admin', adminRoutes);

// ─── Health Check ────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

// ─── Error Handler ───────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: config.nodeEnv === 'production' ? 'Erreur interne' : err.message,
  });
});

// ─── Start ───────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`🏗️  ArchiVision API → http://localhost:${config.port}`);
  console.log(`📦 Mode: ${config.nodeEnv}`);
});

export default app;
