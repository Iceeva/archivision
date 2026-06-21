// Export Service — Génère différents formats d'export

interface ExportData {
  project: any;
  plan: any;
  materials?: any;
  budget?: any;
}

// ─── Export JSON complet ─────────────────────────────────
export function exportJSON(data: ExportData): string {
  return JSON.stringify(data, null, 2);
}

// ─── Export SVG (plan 2D) ────────────────────────────────
export function exportSVG(plan: any): string {
  const scale = 30; // 1m = 30px
  const rooms = plan.rooms || [];
  const padding = 50;

  let maxX = 0, maxY = 0;
  rooms.forEach((r: any) => {
    maxX = Math.max(maxX, (r.x + r.width) * scale);
    maxY = Math.max(maxY, (r.y + r.length) * scale);
  });

  const width = maxX + padding * 2;
  const height = maxY + padding * 2;

  const roomColors: Record<string, string> = {
    living: '#E8F5E9', bedroom: '#E3F2FD', kitchen: '#FFF3E0',
    bathroom: '#E0F7FA', entry: '#F3E5F5', garage: '#ECEFF1',
    terrace: '#F1F8E9', pool: '#B3E5FC',
  };

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <style>
    .room { stroke: #333; stroke-width: 2; }
    .label { font-family: Arial; font-size: 11px; fill: #333; text-anchor: middle; }
    .dim { font-family: Arial; font-size: 9px; fill: #666; text-anchor: middle; }
    .title { font-family: Arial; font-size: 16px; font-weight: bold; fill: #1a1a1a; }
  </style>
  <text x="${width / 2}" y="25" class="title" text-anchor="middle">${plan.name || 'Plan'}</text>\n`;

  rooms.forEach((room: any) => {
    const x = room.x * scale + padding;
    const y = room.y * scale + padding;
    const w = room.width * scale;
    const h = room.length * scale;
    const fill = roomColors[room.type] || '#F5F5F5';

    svg += `  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" class="room" />\n`;
    svg += `  <text x="${x + w / 2}" y="${y + h / 2 - 6}" class="label">${room.name}</text>\n`;
    svg += `  <text x="${x + w / 2}" y="${y + h / 2 + 10}" class="dim">${room.width}m × ${room.length}m</text>\n`;
    svg += `  <text x="${x + w / 2}" y="${y + h / 2 + 22}" class="dim">${room.area}m²</text>\n`;
  });

  // Portes
  (plan.doors || []).forEach((door: any) => {
    const dx = door.x * scale + padding;
    const dy = door.y * scale + padding;
    svg += `  <line x1="${dx - 8}" y1="${dy}" x2="${dx + 8}" y2="${dy}" stroke="#8B4513" stroke-width="4" />\n`;
  });

  // Fenêtres
  (plan.windows || []).forEach((win: any) => {
    const wx = win.x * scale + padding;
    const wy = win.y * scale + padding;
    svg += `  <line x1="${wx - 10}" y1="${wy}" x2="${wx + 10}" y2="${wy}" stroke="#2196F3" stroke-width="3" />\n`;
  });

  svg += '</svg>';
  return svg;
}

// ─── Export DXF (AutoCAD compatible) ─────────────────────
export function exportDXF(plan: any): string {
  const rooms = plan.rooms || [];
  let dxf = `0\nSECTION\n2\nENTITIES\n`;

  rooms.forEach((room: any) => {
    // Rectangle pour chaque pièce
    const x1 = room.x, y1 = room.y;
    const x2 = room.x + room.width, y2 = room.y + room.length;

    dxf += `0\nLWPOLYLINE\n8\n0\n90\n4\n70\n1\n`;
    dxf += `10\n${x1}\n20\n${y1}\n`;
    dxf += `10\n${x2}\n20\n${y1}\n`;
    dxf += `10\n${x2}\n20\n${y2}\n`;
    dxf += `10\n${x1}\n20\n${y2}\n`;

    // Label
    dxf += `0\nTEXT\n8\n0\n10\n${(x1 + x2) / 2}\n20\n${(y1 + y2) / 2}\n40\n0.3\n1\n${room.name}\n`;
  });

  dxf += `0\nENDSEC\n0\nEOF\n`;
  return dxf;
}

// ─── Export OBJ (3D) ─────────────────────────────────────
export function exportOBJ(plan: any): string {
  const rooms = plan.rooms || [];
  let obj = `# ArchiVision AI — Export 3D OBJ\n# ${plan.name}\n\n`;
  let vertexOffset = 1;

  rooms.forEach((room: any) => {
    const h = 3; // Hauteur standard
    const x = room.x, y = room.y;
    const w = room.width, l = room.length;
    const fh = room.floor * h;

    obj += `\n# ${room.name}\n`;
    obj += `g ${room.name.replace(/\s/g, '_')}\n`;

    // 8 vertices du cube
    obj += `v ${x} ${fh} ${y}\n`;
    obj += `v ${x + w} ${fh} ${y}\n`;
    obj += `v ${x + w} ${fh} ${y + l}\n`;
    obj += `v ${x} ${fh} ${y + l}\n`;
    obj += `v ${x} ${fh + h} ${y}\n`;
    obj += `v ${x + w} ${fh + h} ${y}\n`;
    obj += `v ${x + w} ${fh + h} ${y + l}\n`;
    obj += `v ${x} ${fh + h} ${y + l}\n`;

    // 6 faces
    const v = vertexOffset;
    obj += `f ${v} ${v + 1} ${v + 2} ${v + 3}\n`;   // Sol
    obj += `f ${v + 4} ${v + 7} ${v + 6} ${v + 5}\n`; // Plafond
    obj += `f ${v} ${v + 4} ${v + 5} ${v + 1}\n`;     // Face avant
    obj += `f ${v + 2} ${v + 6} ${v + 7} ${v + 3}\n`; // Face arrière
    obj += `f ${v} ${v + 3} ${v + 7} ${v + 4}\n`;     // Face gauche
    obj += `f ${v + 1} ${v + 5} ${v + 6} ${v + 2}\n`; // Face droite

    vertexOffset += 8;
  });

  return obj;
}
