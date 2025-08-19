"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Source_Sans_3 } from "next/font/google";

// Font must be created at module scope
const cashSans = Source_Sans_3({ subsets: ["latin"], weight: ["400", "700"] });

type FullScreenMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  initialContext?: "think" | "participants";
};

const thinkItems: Array<{ label: string; href: string }> = [
  { label: "What We Do", href: "/think-tank/what-we-do" },
  { label: "Governance & Policy", href: "/think-tank/governance-policy" },
  { label: "Data & Insights", href: "/think-tank/data-insights" },
  { label: "Education Pipeline", href: "/think-tank/education-pipeline" },
  { label: "Capstone Projects", href: "/think-tank/capstone-projects" },
];

const participantsItems: Array<{ label: string; href: string }> = [
  { label: "Who We Are", href: "/participants/who-we-are" },
  { label: "Main Objective", href: "/participants/main-objective" },
  { label: "Service Opportunities", href: "/participants/service-opportunities" },
  { label: "Client Work Network", href: "/participants/client-work-network" },
  { label: "NGO Collaborations", href: "/participants/ngo-collaborations" },
  { label: "Path to Ownership", href: "/participants/path-to-ownership" },
];

export default function FullScreenMenu({ isOpen, onClose, initialContext }: FullScreenMenuProps) {
  const router = useRouter();
  const [context, setContext] = useState<"think" | "participants">(initialContext ?? "think");

  useEffect(() => {
    setContext(initialContext ?? "think");
  }, [initialContext, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const handleNavigate = (href: string) => {
    onClose();
    router.push(href);
  };

  // Track mouse for tooltip offset
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [isOpen]);

  const menuItems = context === "think" ? thinkItems : participantsItems;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-white text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="h-full w-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 h-16">
              <div className="container mx-auto px-4 h-full flex items-center justify-between relative">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold tracking-wide" style={{ position: 'absolute' }}>
                  {context === "think" ? "Think Tank" : "Participants"}
                  <a
                    href="https://design.cash.app/"
                    title="https://design.cash.app/"
                    draggable="false"
                    className="absolute inset-0 z-10 block cursor-pointer"
                    style={{ pointerEvents: 'all' }}
                    target="_blank"
                    rel="noreferrer noopener"
                  />
                </div>
                <div className="flex items-center gap-6">
                  <nav className="flex items-center gap-6 text-sm">
                    <button className={`text-black/70 hover:text-black transition-colors ${context === "think" ? "font-semibold" : ""}`} onClick={() => setContext("think")}>
                      Think Tank
                    </button>
                    <button className={`text-black/70 hover:text-black transition-colors ${context === "participants" ? "font-semibold" : ""}`} onClick={() => setContext("participants")}>
                      Participants
                    </button>
                    <a href="https://hood.beamthinktank.space" target="_blank" rel="noopener noreferrer" className="text-black/70 hover:text-black transition-colors">
                      Hood
                    </a>
                    <a href="#" className="text-black/70 hover:text-black transition-colors">
                      Support
                    </a>
                  </nav>
                  <button
                    aria-label="Close menu"
                    className="p-2 rounded-md hover:bg-black/5"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="grid grid-cols-1 gap-y-6 relative">
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={item.label}
                      className="text-left group relative"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.05 * index, duration: 0.4, ease: "easeOut" }}
                      onClick={() => handleNavigate(item.href)}
                    >
                      <div className="flex items-end justify-between border-b border-black/10 pb-2">
                        <div className="w-full">
                          <div className={`text-[10vw] leading-none font-bold tracking-tight md:text-[7rem] lg:text-[8rem] transition-transform group-hover:translate-x-4 md:group-hover:translate-x-6 ${cashSans.className}`}>
                            {item.label}
                          </div>
                        </div>
                      </div>
                      {/* Mouse-following large preview */}
                      <div className="pointer-events-none absolute inset-0 overflow-visible">
                        <div
                          className="hidden group-hover:flex items-center justify-center absolute z-50 w-[360px] h-[220px] md:w-[420px] md:h-[260px] rounded-xl border border-black/10 shadow-2xl bg-neutral-900 text-white"
                          style={{ transform: 'translate3d(calc(var(--mx,0px) + 24px), calc(var(--my,0px) + 24px), 0)' }}
                        >
                          {/* Placeholder graphic */}
                          <div className="relative w-full h-full">
                            <div className="absolute inset-0 rounded-xl bg-neutral-900" />
                            <div className="absolute left-8 top-8 w-36 h-36 md:w-40 md:h-40 rounded-full bg-lime-500" />
                            <div className="absolute left-[180px] top-8 w-20 h-20 rounded-full bg-white" />
                            <div className="absolute left-[260px] top-10 w-20 h-20 rounded-full bg-lime-300" />
                            <div className="absolute left-[210px] top-[130px] w-20 h-20 rounded-full bg-black border border-white/20" />
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer pinned to bottom */}
            <div className="flex-shrink-0 border-t border-black/10">
              <footer className="mx-auto max-w-7xl px-6 py-6 text-xs text-black/70">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <a className="hover:text-black transition-colors" href="#">Logo download</a>
                  <a className="hover:text-black transition-colors" href="#">Type download</a>
                  <a className="hover:text-black transition-colors" href="#">Press kit</a>
                  <a className="hover:text-black transition-colors" href="#">Work at BEAM</a>
                </div>
              </footer>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

