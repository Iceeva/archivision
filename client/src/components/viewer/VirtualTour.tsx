import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { GeneratedPlan } from '@/types';
import { Play, Pause, SkipForward, Eye } from 'lucide-react';

const ROOM_3D_COLORS: Record<string, string> = {
  living: '#4CAF50', bedroom: '#2196F3', kitchen: '#FF9800',
  bathroom: '#00BCD4', entry: '#9C27B0', garage: '#607D8B',
};

function TourScene({ plan, roomIndex }: { plan: GeneratedPlan; roomIndex: number }) {
  const { camera } = useThree();
  const room = plan.rooms[roomIndex];

  useEffect(() => {
    if (room) {
      camera.position.set(room.x + room.width / 2, 1.6, room.y + room.length / 2);
    }
  }, [roomIndex, room]);

  return (
    <group>
      {plan.rooms.map((r, i) => {
        const height = 3;
        const color = ROOM_3D_COLORS[r.type] || '#888';
        return (
          <group key={i} position={[r.x + r.width / 2, r.floor * height, r.y + r.length / 2]}>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
              <planeGeometry args={[r.width, r.length]} />
              <meshStandardMaterial color={color} transparent opacity={0.4} />
            </mesh>
            {/* Ceiling */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height - 0.01, 0]}>
              <planeGeometry args={[r.width, r.length]} />
              <meshStandardMaterial color="#222" />
            </mesh>
            {/* Walls */}
            {[
              { pos: [0, height / 2, r.length / 2] as const, rot: [0, 0, 0] as const, size: [r.width, height] as const },
              { pos: [0, height / 2, -r.length / 2] as const, rot: [0, Math.PI, 0] as const, size: [r.width, height] as const },
              { pos: [r.width / 2, height / 2, 0] as const, rot: [0, -Math.PI / 2, 0] as const, size: [r.length, height] as const },
              { pos: [-r.width / 2, height / 2, 0] as const, rot: [0, Math.PI / 2, 0] as const, size: [r.length, height] as const },
            ].map((wall, wi) => (
              <mesh key={wi} position={wall.pos} rotation={wall.rot}>
                <planeGeometry args={wall.size} />
                <meshStandardMaterial color="#e0e0e0" side={THREE.DoubleSide} transparent opacity={0.8} />
              </mesh>
            ))}
            {/* Room label */}
            <Text position={[0, 2.5, 0]} fontSize={0.25} color={color} anchorX="center" anchorY="middle">
              {r.name}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

interface Props { plan: GeneratedPlan; }

export default function VirtualTour({ plan }: Props) {
  const [roomIndex, setRoomIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const room = plan.rooms[roomIndex];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setRoomIndex(i => (i + 1) % plan.rooms.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, plan.rooms.length]);

  return (
    <div className="w-full h-full relative">
      {/* 3D Canvas */}
      <Canvas shadows className="three-canvas">
        <ambientLight intensity={0.5} />
        <pointLight position={[room?.x || 0 + 2, 2.5, room?.y || 0 + 2]} intensity={0.8} />
        <Suspense fallback={null}>
          <Environment preset="apartment" />
          <TourScene plan={plan} roomIndex={roomIndex} />
        </Suspense>
        <PointerLockControls />
      </Canvas>

      {/* Room indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 glass rounded-xl px-4 py-2 flex items-center gap-3">
        <Eye size={14} className="text-brand-400" />
        <span className="text-sm font-medium">{room?.name || 'Vue'}</span>
        <span className="text-xs text-dark-300">{room?.area}m²</span>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-xl px-4 py-2 flex items-center gap-3">
        <button onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg hover:bg-dark-500">
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <div className="flex gap-1">
          {plan.rooms.map((r, i) => (
            <button key={i} onClick={() => setRoomIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === roomIndex ? 'bg-brand-500 w-4' : 'bg-dark-400'}`} />
          ))}
        </div>

        <button onClick={() => setRoomIndex(i => (i + 1) % plan.rooms.length)}
          className="p-2 rounded-lg hover:bg-dark-500">
          <SkipForward size={14} />
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 glass rounded-xl p-3 text-[10px] text-dark-300 max-w-[160px]">
        <p>🖱️ Cliquez pour contrôler la caméra</p>
        <p>⎋ Échap pour libérer le curseur</p>
      </div>
    </div>
  );
}
