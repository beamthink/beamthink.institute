"use client";

import TopNavigation from '@/components/TopNavigation';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCallback } from 'react';

type HomeCardProps = {
  type: 'video' | 'image' | 'emoji';
  src: string;
  title: string;
};

function HomeCard({ type, src, title }: HomeCardProps) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {type === 'video' && (
        <video autoPlay loop muted playsInline className="w-20 h-20 object-cover rounded-lg">
          <source src={src} type="video/mp4" />
        </video>
      )}
      {type === 'image' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={title} className="w-20 h-20 object-contain rounded-lg" />
      )}
      {type === 'emoji' && <span className="text-5xl">{src}</span>}
      <p className="mt-2 text-sm text-center text-white/80">{title}</p>
    </div>
  );
}

const cards: HomeCardProps[] = [
  { type: 'video', src: '/videos/cleaning.mp4', title: 'BEAM Cleaning NGO' },
  { type: 'image', src: '/placeholder-logo.png', title: 'BEAM Transportation' },
  { type: 'emoji', src: '🎻', title: 'BEAM Orchestra' },
  { type: 'emoji', src: '🏗️', title: 'Infrastructure' },
  { type: 'image', src: '/placeholder-user.jpg', title: 'People Ops' },
  { type: 'emoji', src: '🛰️', title: 'SatComms' },
  { type: 'emoji', src: '🧪', title: 'R&D' },
  { type: 'image', src: '/placeholder.png', title: 'Design Lab' },
  // repeat/mix to fill grid
];

export default function HomeGridPage() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 80, damping: 20, mass: 0.3 });
  const y = useSpring(my, { stiffness: 80, damping: 20, mass: 0.3 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const nx = (e.clientX / innerWidth - 0.5) * 20; // max 20px offset
    const ny = (e.clientY / innerHeight - 0.5) * 20;
    mx.set(nx);
    my.set(ny);
  }, [mx, my]);

  return (
    <div className="relative min-h-screen bg-black text-white" onMouseMove={handleMouseMove}>
      <TopNavigation />

      <div className="pt-24 pb-24">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-8 gap-y-16 place-items-center"
            style={{ x, y }}
          >
            {Array.from({ length: 64 }).map((_, i) => {
              const card = cards[i % cards.length];
              return (
                <motion.a
                  key={i}
                  href={i % 8 === 0 ? '/dashboard' : '#'}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: (i % 12) * 0.02 }}
                  whileHover={{ scale: 1.08 }}
                  className="select-none"
                  aria-label={card.title}
                >
                  <HomeCard {...card} />
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}