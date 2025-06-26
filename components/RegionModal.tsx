'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Region {
  name: string;
  pods: Array<{
    slug: string;
    name: string;
    description: string;
    status: string;
  }>;
}

export default function RegionModal({ region, onClose }: { region: Region; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-xl shadow-2xl p-8 max-w-lg w-full relative"
          initial={{ scale: 0.9, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 40 }}
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">{region.name}</h2>
          <div className="mb-4 text-gray-300">PODs in this region:</div>
          <ul>
            {region.pods.map(pod => (
              <li key={pod.slug} className="mb-2">
                <a
                  href={`/nodes/${pod.slug}`}
                  className="block px-3 py-2 rounded bg-gray-800 hover:bg-cyan-700 text-white transition"
                >
                  <div className="font-semibold">{pod.name}</div>
                  <div className="text-sm text-gray-300">{pod.description}</div>
                  <div className="text-xs text-cyan-300">{pod.status}</div>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}