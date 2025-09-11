import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Research - IslamOne Research",
  description: "Islamic research tools and resources",
};

export default function Research() {
  const tools = [
    {
      title: "Verse Analysis",
      description: "Deep analysis of Quranic verses with cross-references",
      status: "Coming Soon"
    },
    {
      title: "Hadith Verification",
      description: "Tools to verify and grade Hadith authenticity",
      status: "Coming Soon"
    },
    {
      title: "Topic Explorer",
      description: "Explore Islamic topics across Quran and Hadith",
      status: "Coming Soon"
    },
    {
      title: "Scholarly Articles",
      description: "Access to peer-reviewed Islamic research",
      status: "Coming Soon"
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 mb-8">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-4">
          Research Tools
        </h1>
        <p className="text-neutral-500">
          Advanced tools for Islamic scholarship and research.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-medium text-neutral-800">Available Tools</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="bg-neutral-50 rounded-lg p-6 border border-neutral-300"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium text-neutral-800">
                  {tool.title}
                </h3>
                <span className="text-xs px-2 py-1 bg-warning/20 text-warning rounded">
                  {tool.status}
                </span>
              </div>
              <p className="text-neutral-500 mb-4">
                {tool.description}
              </p>
              <button
                disabled
                className="px-4 py-2 bg-neutral-300 text-neutral-500 rounded cursor-not-allowed text-sm"
              >
                Access Tool
              </button>
            </div>
          ))}
        </div>

        <div className="bg-primary-subtle rounded-lg p-6 border border-primary/20">
          <h3 className="text-lg font-medium text-neutral-800 mb-4">
            Research Platform Development
          </h3>
          <p className="text-neutral-500 mb-4">
            We&apos;re building comprehensive research tools that will help scholars 
            and students dive deeper into Islamic texts. These tools will include 
            advanced search capabilities, cross-referencing, and analytical features.
          </p>
          <p className="text-sm text-neutral-500">
            Want to be notified when these tools become available? 
            <a href="/contact" className="text-primary hover:underline ml-1">
              Contact us
            </a> to join our research community.
          </p>
        </div>
      </div>
    </div>
  );
}