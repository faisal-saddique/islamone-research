import { SkeletonWithShimmer } from "~/components/ui/skeleton";
import { BookOpen, ChevronLeft } from "lucide-react";

export function HadithReaderSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <ChevronLeft className="w-5 h-5" />
              <SkeletonWithShimmer className="h-5 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <SkeletonWithShimmer className="w-20 h-9 rounded-lg" />
              <SkeletonWithShimmer className="w-9 h-9 rounded-lg" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <SkeletonWithShimmer className="h-8 w-48" />
            </div>
            <SkeletonWithShimmer className="h-10 w-64 mx-auto mb-4" />
            <div className="flex items-center justify-center gap-4">
              <SkeletonWithShimmer className="h-4 w-32" />
              <SkeletonWithShimmer className="h-4 w-20" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <SkeletonWithShimmer className="h-10 w-40 rounded-lg" />
          <SkeletonWithShimmer className="h-6 w-24 rounded-full" />
          <SkeletonWithShimmer className="h-10 w-36 rounded-lg" />
        </div>

        {/* Hadiths */}
        <div className="max-w-4xl mx-auto space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border-2 border-gray-200 p-6"
            >
              <div className="space-y-6">
                {/* Hadith Number */}
                <div className="text-center">
                  <SkeletonWithShimmer className="w-6 h-6 rounded-full mx-auto" />
                </div>

                {/* Arabic Text */}
                <div className="space-y-3">
                  <SkeletonWithShimmer className="h-8 w-full" />
                  <SkeletonWithShimmer className="h-8 w-11/12 mx-auto" />
                  <SkeletonWithShimmer className="h-8 w-10/12 mx-auto" />
                  <SkeletonWithShimmer className="h-8 w-9/12 mx-auto" />
                </div>

                {/* Translations */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                    <SkeletonWithShimmer className="h-4 w-20 mb-3" />
                    <div className="space-y-2">
                      <SkeletonWithShimmer className="h-5 w-full" />
                      <SkeletonWithShimmer className="h-5 w-11/12" />
                      <SkeletonWithShimmer className="h-5 w-10/12" />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-emerald-400">
                    <SkeletonWithShimmer className="h-4 w-32 mb-3" />
                    <div className="space-y-2">
                      <SkeletonWithShimmer className="h-5 w-full" />
                      <SkeletonWithShimmer className="h-5 w-10/12" />
                      <SkeletonWithShimmer className="h-5 w-9/12" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
