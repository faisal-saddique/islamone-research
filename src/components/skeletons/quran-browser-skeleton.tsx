import { SkeletonWithShimmer } from "~/components/ui/skeleton";
import { BookOpen, Search } from "lucide-react";

export function QuranBrowserSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-semibold text-gray-800">Holy Quran</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read and study the Holy Quran with multiple translations and commentary
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <SkeletonWithShimmer className="h-12 w-full rounded-lg" />
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <SkeletonWithShimmer key={i} className="h-12 w-24 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 text-center border border-gray-200">
                <SkeletonWithShimmer className="h-8 w-16 mx-auto mb-2" />
                <SkeletonWithShimmer className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Surahs Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    {/* Surah Number */}
                    <SkeletonWithShimmer className="w-14 h-14 rounded-full" />

                    {/* Surah Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <SkeletonWithShimmer className="h-6 w-32" />
                        <SkeletonWithShimmer className="h-6 w-24" />
                      </div>
                      <div className="flex items-center gap-4">
                        <SkeletonWithShimmer className="h-4 w-24" />
                        <SkeletonWithShimmer className="h-4 w-16" />
                        <SkeletonWithShimmer className="h-4 w-20" />
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-2">
                    <SkeletonWithShimmer className="w-9 h-9 rounded-lg" />
                    <SkeletonWithShimmer className="w-5 h-5 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
