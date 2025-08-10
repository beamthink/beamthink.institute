type Section = {
  title: string;
  body: string[];
};

const sections: Record<string, Section> = {
  "what-we-do": {
    title: "What We Do",
    body: [
      "This section outlines the core initiatives and activities of the Think Tank.",
      "Use this page to summarize programs, research areas, and outcomes with links to deeper docs.",
    ],
  },
  "governance-policy": {
    title: "Governance & Policy",
    body: [
      "Explain governance structures, decision-making frameworks, and policy standards.",
      "Include charters, roles, and escalation paths as the content matures.",
    ],
  },
  "data-insights": {
    title: "Data & Insights",
    body: [
      "Summarize data sources, analysis pipelines, and key insights.",
      "Embed charts or dashboards here as they are developed.",
    ],
  },
  "education-pipeline": {
    title: "Education Pipeline",
    body: [
      "Describe curricula, certifications, and training pathways.",
      "Add cohorts, milestones, and learning resources.",
    ],
  },
  "capstone-projects": {
    title: "Capstone Projects",
    body: [
      "Highlight active and past capstones with goals, teams, and artifacts.",
      "Provide application and review processes when ready.",
    ],
  },
};

export default function SectionPage({ params }: { params: { slug: string } }) {
  const section = sections[params.slug] ?? {
    title: "Section",
    body: ["Content coming soon."],
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-[40px] md:text-[56px] font-bold leading-tight text-black">{section.title}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <div className="aspect-[16/9] w-full rounded-lg bg-[#36e218]" />
        </div>
        <div>
          <div className="text-sm text-gray-700 space-y-3">
            {section.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10 h-80 rounded-lg border border-gray-200 bg-gray-50" />
    </div>
  );
}

