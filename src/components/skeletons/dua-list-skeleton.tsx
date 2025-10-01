import { SkeletonWithShimmer } from "~/components/ui/skeleton";
import { ArrowLeft, Heart, Search } from "lucide-react";

export function DuaListSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-gray-600 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Collections
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <SkeletonWithShimmer className="h-8 w-64 mx-auto mb-2" />
              <SkeletonWithShimmer className="h-5 w-24 mx-auto" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <SkeletonWithShimmer className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Duas List */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
              >
                {/* Title */}
                <div className="mb-4 pb-4 border-b border-gray-100 text-center">
                  <SkeletonWithShimmer className="h-6 w-64 mx-auto" />
                </div>

                {/* Intro */}
                <div className="mb-4 p-4 bg-primary-subtle/30 rounded-lg">
                  <div className="space-y-2">
                    <SkeletonWithShimmer className="h-4 w-full" />
                    <SkeletonWithShimmer className="h-4 w-5/6 ml-auto" />
                  </div>
                </div>

                {/* Arabic Text */}
                <div className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <SkeletonWithShimmer className="h-4 w-16" />
                    <SkeletonWithShimmer className="w-8 h-8 rounded-lg" />
                  </div>
                  <div className="space-y-3">
                    <SkeletonWithShimmer className="h-8 w-full" />
                    <SkeletonWithShimmer className="h-8 w-11/12 ml-auto" />
                    <SkeletonWithShimmer className="h-8 w-10/12 ml-auto" />
                  </div>
                </div>

                {/* Translation */}
                <div className="mb-6 p-6 bg-white rounded-lg border border-gray-200">
                  <SkeletonWithShimmer className="h-4 w-24 mb-3" />
                  <div className="space-y-2">
                    <SkeletonWithShimmer className="h-5 w-full" />
                    <SkeletonWithShimmer className="h-5 w-11/12 ml-auto" />
                    <SkeletonWithShimmer className="h-5 w-10/12 ml-auto" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <SkeletonWithShimmer className="h-8 w-24" />
                  <SkeletonWithShimmer className="h-10 w-32 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
