type Section = {
  title: string;
  body: string[];
};

const sections: Record<string, Section> = {
  "who-we-are": {
    title: "Who We Are",
    body: [
      "Introduce the community, roles, and how people participate.",
      "Add short bios, affiliations, and ways to connect.",
    ],
  },
  "main-objective": {
    title: "Main Objective",
    body: [
      "State the primary mission and objectives for participants.",
      "Include success metrics and participation guidelines.",
    ],
  },
  "service-opportunities": {
    title: "Service Opportunities",
    body: [
      "List volunteer or contributor opportunities with expectations.",
      "Provide onboarding links or forms when available.",
    ],
  },
  "client-work-network": {
    title: "Client Work Network",
    body: [
      "Describe the network of clients and the process for engagements.",
      "Surface case studies and open collaborations.",
    ],
  },
  "ngo-collaborations": {
    title: "NGO Collaborations",
    body: [
      "Showcase partnerships with NGOs and non-profits.",
      "Outline collaboration models and contact paths.",
    ],
  },
  "path-to-ownership": {
    title: "Path to Ownership",
    body: [
      "Explain pathways to cooperative or equity ownership.",
      "Detail membership tiers, milestones, and benefits.",
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

