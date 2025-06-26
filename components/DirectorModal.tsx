'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Director {
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
  committees: Array<{
    name: string;
    description: string;
    members: string[];
  }>;
  slug: string;
}

interface DirectorModalProps {
  director: Director;
  onClose: () => void;
}

export default function DirectorModal({ director, onClose }: DirectorModalProps) {
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
          <div className="flex items-center gap-4 mb-4">
            <img
              src={director.avatarUrl}
              alt={director.name}
              className="w-16 h-16 rounded-full border-2 border-cyan-400"
            />
            <div>
              <div className="text-xl font-bold text-cyan-300">{director.name}</div>
              <div className="text-sm text-cyan-200">{director.role}</div>
            </div>
          </div>
          <div className="mb-4 text-gray-300">{director.bio}</div>
          <div className="mb-2 font-semibold text-cyan-400">Committees & Subcommittees</div>
          <ul className="mb-4">
            {director.committees.map((c, idx) => (
              <li key={idx} className="mb-2">
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-gray-300">{c.description}</div>
                <div className="text-xs text-cyan-300">
                  Members: {c.members.join(', ')}
                </div>
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-white font-semibold transition">
              Chat with AI
            </button>
            <a
              href={`/people/${director.slug}`}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-cyan-700 text-white font-semibold transition"
            >
              View Full Profile
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}