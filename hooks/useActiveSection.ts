import { useEffect, useState } from 'react';

/**
 * Custom hook for scroll spy functionality.
 * @param sectionIds Array of section IDs to track (should match element IDs in the DOM)
 * @returns The currently active section ID
 */
export function useActiveSection(sectionIds: string[]): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    function onScroll() {
      let current: string | null = null;
      for (let i = 0; i < sectionIds.length; i++) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 120) {
            current = sectionIds[i];
          }
        }
      }
      setActiveSection(current || sectionIds[0]);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initialize on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, [sectionIds]);

  return activeSection;
} 