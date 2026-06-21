import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import type { GeneratedPlan, PlanRoom } from '@/types';
import { ROOM_TYPE_COLORS } from '@/config/materials';
import { useUIStore } from '@/store/uiStore';

interface Props { plan: GeneratedPlan; }

const SCALE = 35; // 1m = 35px
const PADDING = 60;

export default function FloorPlanView({ plan }: Props) {
  const { activeFloor, setActiveFloor } = useUIStore();
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredRoom, setHoveredRoom] = useState<PlanRoom | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const floorRooms = plan.rooms.filter(r => r.floor === activeFloor);
  const floors = [...new Set(plan.rooms.map(r => r.floor))].sort();

  let maxX = 0, maxY = 0;
  plan.rooms.forEach(r => {
    maxX = Math.max(maxX, (r.x + r.width) * SCALE);
    maxY = Math.max(maxY, (r.y + r.length) * SCALE);
  });
  const viewWidth = maxX + PADDING * 2;
  const viewHeight = maxY + PADDING * 2;

  return (
    <div className="w-full h-full relative overflow-hidden bg-dark-900">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <button onClick={() => setZoom(z => Math.min(3, z + 0.2))}
          className="p-2 rounded-xl glass hover:bg-dark-600"><ZoomIn size={16} /></button>
        <button onClick={() => setZoom(z => Math.max(0.3, z - 0.2))}
          className="p-2 rounded-xl glass hover:bg-dark-600"><ZoomOut size={16} /></button>
        <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
          className="p-2 rounded-xl glass hover:bg-dark-600"><RotateCcw size={16} /></button>
      </div>

      {/* Floor Selector */}
      {floors.length > 1 && (
        <div className="absolute top-4 right-4 z-10 glass rounded-xl p-1 flex flex-col gap-1">
          {floors.map(f => (
            <button key={f} onClick={() => setActiveFloor(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${activeFloor === f ? 'bg-brand-500 text-white' : 'text-dark-200 hover:bg-dark-500'}`}>
              {f === 0 ? 'RDC' : `${f}er`}
            </button>
          ))}
        </div>
      )}

      {/* Hovered Room Info */}
      {hoveredRoom && (
        <div className="absolute bottom-4 left-4 z-10 glass rounded-xl p-3 min-w-[180px]">
          <h4 className="text-sm font-semibold">{hoveredRoom.name}</h4>
          <p className="text-xs text-dark-200 mt-1">
            {hoveredRoom.width}m × {hoveredRoom.length}m = {hoveredRoom.area}m²
          </p>
        </div>
      )}

      {/* SVG Plan */}
      <div className="w-full h-full flex items-center justify-center"
        style={{ transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`, transformOrigin: 'center' }}>
        <svg ref={svgRef} width={viewWidth} height={viewHeight} viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="max-w-full max-h-full">

          {/* Grid */}
          <defs>
            <pattern id="grid" width={SCALE} height={SCALE} patternUnits="userSpaceOnUse">
              <path d={`M ${SCALE} 0 L 0 0 0 ${SCALE}`} fill="none" stroke="#1A1A24" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Rooms */}
          {floorRooms.map((room, i) => {
            const x = room.x * SCALE + PADDING;
            const y = room.y * SCALE + PADDING;
            const w = room.width * SCALE;
            const h = room.length * SCALE;
            const colors = ROOM_TYPE_COLORS[room.type] || { bg: '#2D2D3A', border: '#555570', label: room.type };
            const isHovered = hoveredRoom?.id === room.id;

            return (
              <g key={room.id || i}
                onMouseEnter={() => setHoveredRoom(room)}
                onMouseLeave={() => setHoveredRoom(null)}
                className="cursor-pointer transition-all">
                <rect x={x} y={y} width={w} height={h}
                  fill={colors.bg} fillOpacity={isHovered ? 0.5 : 0.3}
                  stroke={colors.border} strokeWidth={isHovered ? 3 : 2}
                  rx={4} />
                {/* Room name */}
                <text x={x + w / 2} y={y + h / 2 - 8}
                  textAnchor="middle" fontSize="11" fontWeight="600" fill="#E0E0E0">
                  {room.name}
                </text>
                {/* Dimensions */}
                <text x={x + w / 2} y={y + h / 2 + 8}
                  textAnchor="middle" fontSize="9" fill="#888">
                  {room.width}m × {room.length}m
                </text>
                <text x={x + w / 2} y={y + h / 2 + 20}
                  textAnchor="middle" fontSize="9" fill="#666">
                  {room.area}m²
                </text>
              </g>
            );
          })}

          {/* Doors */}
          {(plan.doors || []).map((door, i) => {
            const dx = door.x * SCALE + PADDING;
            const dy = door.y * SCALE + PADDING;
            return (
              <g key={`door-${i}`}>
                <rect x={dx - 6} y={dy - 2} width={12} height={4} fill="#8B4513" rx={1} />
                <path d={`M ${dx - 6} ${dy + 2} A 12 12 0 0 1 ${dx + 6} ${dy + 2}`}
                  fill="none" stroke="#8B4513" strokeWidth={0.8} strokeDasharray="2" />
              </g>
            );
          })}

          {/* Windows */}
          {(plan.windows || []).map((win, i) => {
            const wx = win.x * SCALE + PADDING;
            const wy = win.y * SCALE + PADDING;
            return (
              <g key={`win-${i}`}>
                <line x1={wx - 10} y1={wy} x2={wx + 10} y2={wy} stroke="#4FC3F7" strokeWidth={3} />
                <line x1={wx - 10} y1={wy} x2={wx + 10} y2={wy} stroke="#81D4FA" strokeWidth={1} />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
