"use client";
import { motion } from 'framer-motion';

const navItems = [
  "Hero", "Regions", "PODs", "Participants", "NGOs", "Real Estate", "Timeline"
];

export default function SidebarNav() {
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-[#181818] flex flex-col py-6 px-4 z-20">
      {/* Header/Brand as button-like area */}
      <div className="mb-4">
        <div className="flex items-center justify-center h-16 w-full bg-gray-900 border border-gray-700 rounded-lg text-center select-none">
          <span className="text-2xl font-bold text-orange-500">BEAM.</span>
          <span className="text-lg text-white ml-1">Institute.</span>
        </div>
      </div>
      {/* Nav Items fill available space evenly */}
      <ul className="flex-1 flex flex-col gap-4 justify-between">
        {navItems.map((item, idx) => (
          <li key={item} className="flex-1 flex">
            <motion.a
              href={`#${item.toLowerCase()}`}
              className="flex items-center justify-center w-full h-full text-lg bg-transparent border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition text-center"
              whileHover={{ scale: 1.05 }}
              style={{ minHeight: 0 }}
            >
              {item}
            </motion.a>
          </li>
        ))}
      </ul>
      {/* Get Started Button matches nav item size */}
      <div className="mt-4">
        <a
          href="#get-started"
          className="flex items-center justify-center w-full h-16 bg-orange-500 text-white font-bold rounded-lg text-lg hover:bg-orange-600 transition text-center"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}