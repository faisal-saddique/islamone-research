import { SkeletonWithShimmer } from "~/components/ui/skeleton";
import { CheckCircle, Target } from "lucide-react";

export function ReviewPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-semibold text-gray-800">Translation Review</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Review Quran translations for accuracy and authenticity. Your scholarly contributions help maintain the integrity of Islamic texts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Navigation Panel */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Navigation
              </h2>

              {/* Current Location */}
              <div className="mb-6 p-4 bg-primary-subtle rounded-lg text-center">
                <SkeletonWithShimmer className="h-6 w-32 mx-auto mb-2" />
                <SkeletonWithShimmer className="h-4 w-40 mx-auto" />
              </div>

              {/* Quick Navigation */}
              <div className="mb-6">
                <SkeletonWithShimmer className="h-4 w-32 mb-3" />
                <div className="flex gap-2">
                  <SkeletonWithShimmer className="h-12 w-12 rounded-lg" />
                  <SkeletonWithShimmer className="h-12 flex-1 rounded-lg" />
                  <SkeletonWithShimmer className="h-12 w-12 rounded-lg" />
                </div>
              </div>

              {/* Surah Selection */}
              <div className="mb-6">
                <SkeletonWithShimmer className="h-4 w-24 mb-3" />
                <SkeletonWithShimmer className="h-12 w-full rounded-lg" />
              </div>

              {/* Progress Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <SkeletonWithShimmer className="h-4 w-28 mb-2" />
                <div className="flex items-center justify-between mb-3">
                  <SkeletonWithShimmer className="h-8 w-12" />
                  <SkeletonWithShimmer className="h-4 w-8" />
                  <SkeletonWithShimmer className="h-6 w-12" />
                </div>
                <SkeletonWithShimmer className="h-2 w-full rounded-full" />
              </div>
            </div>
          </div>

          {/* Review Panel */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            <div className="space-y-6">
              {/* Arabic Text */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="text-center mb-6">
                  <SkeletonWithShimmer className="w-6 h-6 rounded-full mx-auto mb-3" />
                  <SkeletonWithShimmer className="h-6 w-48 mx-auto" />
                </div>
                <div className="p-8 bg-gray-50 rounded-lg space-y-3">
                  <SkeletonWithShimmer className="h-10 w-full" />
                  <SkeletonWithShimmer className="h-10 w-5/6 mx-auto" />
                  <SkeletonWithShimmer className="h-10 w-4/5 mx-auto" />
                </div>
              </div>

              {/* Translation Review Cards */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <SkeletonWithShimmer className="h-7 w-56 mx-auto mb-6" />
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border-2 border-gray-200 rounded-xl">
                      {/* Translation Header */}
                      <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                        <div className="flex items-center justify-between">
                          <SkeletonWithShimmer className="h-5 w-32" />
                          <SkeletonWithShimmer className="h-6 w-20 rounded-full" />
                        </div>
                      </div>

                      {/* Translation Text */}
                      <div className="p-6 space-y-2">
                        <SkeletonWithShimmer className="h-5 w-full" />
                        <SkeletonWithShimmer className="h-5 w-11/12" />
                        <SkeletonWithShimmer className="h-5 w-10/12" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
