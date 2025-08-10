"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export type SidebarItem = { 
  label: string; 
  href: string;
  subsections?: { label: string; anchor: string }[];
};

type SectionSidebarProps = {
  title: string;
  items: SidebarItem[];
};

export default function SectionSidebar({ title, items }: SectionSidebarProps) {
  const pathname = usePathname();
  const [isParticipantsOpen, setParticipantsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const participantMenuItems: SidebarItem[] = [
    { label: "Who We Are", href: "/participants/who-we-are" },
    { label: "Main Objective", href: "/participants/main-objective" },
    { label: "Service Opportunities", href: "/participants/service-opportunities" },
    { label: "Client Work Network", href: "/participants/client-work-network" },
    { label: "NGO Collaborations", href: "/participants/ngo-collaborations" },
    { label: "Path to Ownership", href: "/participants/path-to-ownership" },
  ];

  const toggleExpanded = (itemLabel: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemLabel)) {
      newExpanded.delete(itemLabel);
    } else {
      newExpanded.add(itemLabel);
    }
    setExpandedItems(newExpanded);
  };

  const scrollToSection = (anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="h-screen">
      <div className="flex flex-col h-full bg-white">
        {/* Top logo header */}
        <div className="border-b border-gray-200 h-16 flex items-center px-4">
          <a href="/" aria-label="Home" className="inline-flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
          </a>
        </div>
        {/* Scrollable nav area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-3">{title}</div>
          <nav className="space-y-1">
            {items.map((item) => {
              const active = pathname === item.href;
              const hasSubsections = item.subsections && item.subsections.length > 0;
              const isExpanded = expandedItems.has(item.label);
              
              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex items-center justify-between px-2 py-2 rounded-md transition-colors ${
                      active
                        ? "bg-black text-white"
                        : "text-gray-700 hover:text-black hover:bg-gray-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    {hasSubsections ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleExpanded(item.label);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                        ) : (
                          <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                        )}
                      </button>
                    ) : (
                      <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                    )}
                  </Link>
                  
                  {/* Subsections */}
                  {hasSubsections && isExpanded && (
                    <div className="pl-4 mt-1 space-y-1">
                      {item.subsections.map((subsection) => (
                        <button
                          key={subsection.anchor}
                          onClick={() => scrollToSection(subsection.anchor)}
                          className="block w-full text-left rounded-md px-2 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                        >
                          {subsection.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer cells */}
        <div className="mt-auto border-t border-gray-200 sticky bottom-4 bg-white">
          {/* Participants expandable cell */}
          <button
            className="w-full flex items-center justify-between text-left px-2 py-3 text-black hover:bg-gray-100"
            onClick={() => setParticipantsOpen((v) => !v)}
            aria-expanded={isParticipantsOpen}
          >
            <span>Participants</span>
            {isParticipantsOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isParticipantsOpen && (
            <div className="pl-4 pb-2 space-y-1">
              {participantMenuItems.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-md px-2 py-2 text-sm transition-colors ${
                      active
                        ? "bg-black text-white"
                        : "text-gray-700 hover:text-black hover:bg-gray-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Hood and Support cells */}
          <Link href="#" className="block px-2 py-3 text-black hover:bg-gray-100">
            Hood
          </Link>
          <Link href="#" className="block px-2 py-3 text-black hover:bg-gray-100">
            Support
          </Link>
        </div>
      </div>
    </aside>
  );
}

