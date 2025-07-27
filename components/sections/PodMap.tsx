// NOTE: This section requires 'react-three-fiber' and '@react-three/drei' to be installed.
// Run: pnpm add @react-three/fiber @react-three/drei three

"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';

// Example data model
const podContent = {
  trunk: {
    name: "Real Estate",
    description: "This Pod is rooted in a commercial kitchen and 12-unit residence built in partnership with XYZ Real Estate Group.",
    partners: ["XYZ Group", "Community Bank"],
  },
  roots: {
    name: "Cell (Community)",
    description: "Local co-ops, faith organizations, and volunteers who support this Pod.",
    members: ["South Atlanta NPU", "Faith Collective", "Volunteers"],
  },
  branches: {
    name: "NGOs",
    description: "Programs that operate from this Pod: food justice, arts, apprenticeship pipeline.",
    partners: ["Harvest Program", "Youth Arts Union"],
  },
  fruit: {
    name: "Impact / Programs",
    description: "This Pod has produced over 25K meals, trained 120 people, and launched 7 co-ops.",
    metrics: {
      mealsServed: 25000,
      peopleTrained: 120,
      coopsLaunched: 7
    }
  }
};

const treeParts = [
  { key: 'trunk', color: '#a16207' },
  { key: 'roots', color: '#78350f' },
  { key: 'branches', color: '#22d3ee' },
  { key: 'fruit', color: '#fbbf24' },
];

type CameraFlyInProps = {};
function CameraFlyIn({}: CameraFlyInProps) {
  const ref = useRef<{ t: number } | null>(null);
  useFrame(({ camera }: { camera: THREE.PerspectiveCamera }) => {
    if (!ref.current) ref.current = { t: 0 };
    if (ref.current.t < 1) {
      ref.current.t += 0.01;
      camera.position.lerp(new THREE.Vector3(0, 2, 8), ref.current.t * 0.05);
      camera.lookAt(0, 2, 0);
    }
  });
  return null;
}

type PodTreeProps = { onSelect: (part: string) => void };
function PodTree({ onSelect }: PodTreeProps) {
  return (
    <>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} onClick={() => onSelect('trunk')} castShadow>
        <cylinderGeometry args={[0.4, 0.6, 2, 16]} />
        <meshStandardMaterial color={treeParts[0].color} />
      </mesh>
      {/* Roots */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} onClick={() => onSelect('roots')}>
        <torusGeometry args={[0.7, 0.15, 16, 100]} />
        <meshStandardMaterial color={treeParts[1].color} />
      </mesh>
      {/* Branches */}
      <mesh position={[0, 2, 0]} onClick={() => onSelect('branches')}>
        <coneGeometry args={[1.2, 2, 16]} />
        <meshStandardMaterial color={treeParts[2].color} />
      </mesh>
      {/* Fruit */}
      <mesh position={[0.7, 3, 0]} onClick={() => onSelect('fruit')}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color={treeParts[3].color} />
      </mesh>
    </>
  );
}

export default function PodMap() {
  const [selectedPart, setSelectedPart] = useState<keyof typeof podContent | null>(null);

  return (
    <section id="pods" className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black py-24 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-extrabold tracking-widest text-amber-200 font-mono mb-2 drop-shadow-[0_0_12px_#fbbf24]"
        style={{ fontFamily: 'Orbitron, monospace' }}
      >
        POD Tree (Proof of Concept)
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="text-amber-300 text-lg mb-8 text-center max-w-2xl"
      >
        Explore the structure and impact of a BEAM Pod as a living, interactive tree. Click each part to learn more.
      </motion.p>
      <div className="w-full max-w-4xl h-[600px] bg-black/80 rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden flex items-center justify-center">
        <Canvas shadows camera={{ position: [0, 2, 12], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
          <PodTree onSelect={setSelectedPart} />
          <CameraFlyIn />
          <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
        </Canvas>
      </div>
      <Dialog open={!!selectedPart} onOpenChange={open => !open && setSelectedPart(null)}>
        <DialogContent className="bg-gray-950 border-amber-400/30 text-white shadow-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold tracking-widest text-amber-200 font-mono flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
              {selectedPart && podContent[selectedPart].name}
            </DialogTitle>
          </DialogHeader>
          <div className="text-amber-100 text-lg mb-2">
            {selectedPart && podContent[selectedPart].description}
          </div>
          {selectedPart === 'trunk' && (
            <div className="mb-2">
              <span className="font-bold text-amber-300">Partners:</span> {podContent.trunk.partners.join(', ')}
            </div>
          )}
          {selectedPart === 'roots' && (
            <div className="mb-2">
              <span className="font-bold text-amber-300">Members:</span> {podContent.roots.members.join(', ')}
            </div>
          )}
          {selectedPart === 'branches' && (
            <div className="mb-2">
              <span className="font-bold text-amber-300">Partners:</span> {podContent.branches.partners.join(', ')}
            </div>
          )}
          {selectedPart === 'fruit' && (
            <div className="mb-2">
              <span className="font-bold text-amber-300">Metrics:</span><br />
              Meals Served: {podContent.fruit.metrics.mealsServed}<br />
              People Trained: {podContent.fruit.metrics.peopleTrained}<br />
              Co-ops Launched: {podContent.fruit.metrics.coopsLaunched}
            </div>
          )}
          <div className="flex justify-end mt-6">
            <Button variant="outline" className="border-amber-400 text-amber-200" onClick={() => setSelectedPart(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
} 