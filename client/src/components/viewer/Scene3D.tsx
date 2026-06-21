import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import type { GeneratedPlan, PlanRoom } from '@/types';

const ROOM_3D_COLORS: Record<string, string> = {
  living: '#4CAF50', bedroom: '#2196F3', kitchen: '#FF9800',
  bathroom: '#00BCD4', entry: '#9C27B0', garage: '#607D8B',
  terrace: '#8BC34A', pool: '#03A9F4',
};

function Room({ room }: { room: PlanRoom }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const height = 3;
  const color = ROOM_3D_COLORS[room.type] || '#888888';

  return (
    <group position={[room.x + room.width / 2, room.floor * height + height / 2, room.y + room.length / 2]}>
      {/* Walls (transparent) */}
      <mesh ref={meshRef}>
        <boxGeometry args={[room.width, height, room.length]} />
        <meshStandardMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(room.width, height, room.length)]} />
        <lineBasicMaterial color={color} linewidth={2} />
      </lineSegments>

      {/* Floor */}
      <mesh position={[0, -height / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[room.width, room.length]} />
        <meshStandardMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {room.name}
      </Text>
      <Text
        position={[0, 0, 0]}
        fontSize={0.2}
        color="#aaa"
        anchorX="center"
        anchorY="middle"
      >
        {room.area}m²
      </Text>
    </group>
  );
}

function House({ plan }: { plan: GeneratedPlan }) {
  return (
    <group>
      {plan.rooms.map((room, i) => (
        <Room key={room.id || i} room={room} />
      ))}
    </group>
  );
}

interface Props { plan: GeneratedPlan; }

export default function Scene3D({ plan }: Props) {
  const centerX = plan.rooms.reduce((sum, r) => sum + r.x + r.width / 2, 0) / (plan.rooms.length || 1);
  const centerZ = plan.rooms.reduce((sum, r) => sum + r.y + r.length / 2, 0) / (plan.rooms.length || 1);

  return (
    <div className="w-full h-full three-canvas">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[centerX + 15, 12, centerZ + 15]} fov={50} />
        <OrbitControls target={[centerX, 1.5, centerZ]} enableDamping dampingFactor={0.1} maxPolarAngle={Math.PI / 2.1} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 15, 5]} intensity={0.8} castShadow
          shadow-mapSize={[2048, 2048]} />
        <hemisphereLight args={['#b1e1ff', '#b97a20', 0.3]} />

        <Suspense fallback={null}>
          <Environment preset="sunset" />

          {/* Ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, -0.01, centerZ]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#1a3a1a" roughness={0.9} />
          </mesh>

          <Grid args={[50, 50]} position={[centerX, 0, centerZ]}
            cellSize={1} cellColor="#333" sectionSize={5} sectionColor="#555"
            fadeDistance={30} infiniteGrid={false} />

          <House plan={plan} />
        </Suspense>
      </Canvas>
    </div>
  );
}
