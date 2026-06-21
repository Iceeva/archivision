import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { exportJSON, exportSVG, exportDXF, exportOBJ } from '../services/exportService';

const router = Router();

// ─── Export au format demandé ────────────────────────────
router.post('/:format', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { format } = req.params;
    const { project, plan, materials, budget } = req.body;

    let content: string;
    let contentType: string;
    let filename: string;

    switch (format.toLowerCase()) {
      case 'json':
        content = exportJSON({ project, plan, materials, budget });
        contentType = 'application/json';
        filename = `${project?.name || 'projet'}.json`;
        break;

      case 'svg':
        content = exportSVG(plan);
        contentType = 'image/svg+xml';
        filename = `${plan?.name || 'plan'}.svg`;
        break;

      case 'dxf':
        content = exportDXF(plan);
        contentType = 'application/dxf';
        filename = `${plan?.name || 'plan'}.dxf`;
        break;

      case 'obj':
        content = exportOBJ(plan);
        contentType = 'text/plain';
        filename = `${plan?.name || 'model'}.obj`;
        break;

      default:
        return res.status(400).json({ error: `Format non supporté: ${format}` });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(content);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
