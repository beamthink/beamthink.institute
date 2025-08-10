import { ReactNode } from "react";
import SectionSidebar, { SidebarItem } from "@/components/SectionSidebar";

export const dynamic = "force-static";

const items: SidebarItem[] = [
  { 
    label: "What We Do", 
    href: "/think-tank/what-we-do",
    subsections: [
      { label: "Mission", anchor: "mission" },
      { label: "Approach", anchor: "approach" },
      { label: "Scope", anchor: "scope" },
      { label: "Unique Value", anchor: "value" }
    ]
  },
  { 
    label: "Governance & Policy", 
    href: "/think-tank/governance-policy",
    subsections: [
      { label: "Governance Model", anchor: "governance" },
      { label: "Policy Priorities", anchor: "policy" },
      { label: "Decision Process", anchor: "decision" },
      { label: "Transparency", anchor: "transparency" }
    ]
  },
  { 
    label: "Data & Insights", 
    href: "/think-tank/data-insights",
    subsections: [
      { label: "Data Sources", anchor: "sources" },
      { label: "Types of Insights", anchor: "insights" },
      { label: "Outputs", anchor: "outputs" },
      { label: "Application", anchor: "application" }
    ]
  },
  { 
    label: "Education Pipeline", 
    href: "/think-tank/education-pipeline",
    subsections: [
      { label: "Entry Points", anchor: "entry" },
      { label: "Progression", anchor: "progression" },
      { label: "Partnerships", anchor: "partnerships" },
      { label: "Special Focus", anchor: "focus" }
    ]
  },
  { 
    label: "Capstone Projects", 
    href: "/think-tank/capstone-projects",
    subsections: [
      { label: "Definition", anchor: "definition" },
      { label: "Examples", anchor: "examples" },
      { label: "Structure", anchor: "structure" },
      { label: "Legacy", anchor: "legacy" }
    ]
  },
];

export default function ThinkTankLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed sidebar */}
      <div className="fixed left-0 top-0 h-screen w-[300px] border-r border-gray-200 bg-white z-40">
        <SectionSidebar title="Think Tank" items={items} />
      </div>

      {/* Main content area */}
      <div className="ml-[300px] min-h-screen">
        {children}
      </div>
    </div>
  );
}

