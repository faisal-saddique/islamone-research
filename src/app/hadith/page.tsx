import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Hadith - IslamOne Research",
  description: "Browse authentic Hadith collections",
};

export default function Hadith() {
  const collections = [
    { name: "Sahih Bukhari", hadithCount: 7563, description: "The most authentic collection" },
    { name: "Sahih Muslim", hadithCount: 7190, description: "Second most authentic collection" },
    { name: "Sunan Abu Dawud", hadithCount: 5274, description: "Collection focusing on legal issues" },
    { name: "Jami at-Tirmidhi", hadithCount: 3956, description: "Known for grading authenticity" },
    { name: "Sunan an-Nasai", hadithCount: 5761, description: "Comprehensive collection" },
    { name: "Sunan Ibn Majah", hadithCount: 4341, description: "Last of the six major collections" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 mb-8">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-4">
          Hadith Collections
        </h1>
        <p className="text-neutral-500">
          Explore authentic Hadith from the six major collections (Kutub al-Sittah).
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="text-lg font-medium text-neutral-800">Collections</h2>
          <input
            type="search"
            placeholder="Search hadith..."
            className="px-3 py-2 bg-neutral-50 border border-neutral-300 rounded text-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <div
              key={collection.name}
              className="bg-neutral-50 rounded-lg p-4 border border-neutral-300 hover:bg-primary-subtle transition-colors cursor-pointer"
            >
              <h3 className="text-lg font-medium text-neutral-800 mb-2">
                {collection.name}
              </h3>
              <p className="text-sm text-neutral-500 mb-3">
                {collection.description}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">
                  {collection.hadithCount.toLocaleString()} Hadith
                </span>
                <span className="text-primary font-medium">Browse →</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
          <h3 className="text-lg font-medium text-neutral-800 mb-4">Coming Soon</h3>
          <p className="text-neutral-500">
            Full Hadith browsing and search functionality is currently under development. 
            Check back soon for complete access to these authentic collections.
          </p>
        </div>
      </div>
    </div>
  );
}