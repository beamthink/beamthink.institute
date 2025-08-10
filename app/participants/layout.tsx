import type { ReactNode } from "react";
import SectionSidebar, { SidebarItem } from "@/components/SectionSidebar";

export const dynamic = "force-static";

// Show Participants primary navigation on the Participants pages
const participantsItems: SidebarItem[] = [
  { label: "Who We Are", href: "/participants/who-we-are" },
  { label: "Main Objective", href: "/participants/main-objective" },
  { label: "Service Opportunities", href: "/participants/service-opportunities" },
  { label: "Client Work Network", href: "/participants/client-work-network" },
  { label: "NGO Collaborations", href: "/participants/ngo-collaborations" },
  { label: "Path to Ownership", href: "/participants/path-to-ownership" },
];

export default function ParticipantsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white">
      {/* Fixed sidebar */}
      <div className="fixed left-0 top-0 h-screen w-[300px] border-r border-gray-200 bg-white z-40">
        <SectionSidebar title="Participants" items={participantsItems} />
      </div>

      {/* Scrollable content */}
      <div className="ml-[300px] min-h-screen">
        <div className="h-[64px] flex items-center justify-center border-b border-gray-200">
          <div className="text-sm font-semibold tracking-wide text-black">Brand Guidelines</div>
        </div>
        <div className="px-6 md:px-10 py-10">
          {children}
        </div>
      </div>
    </div>
  );
}

