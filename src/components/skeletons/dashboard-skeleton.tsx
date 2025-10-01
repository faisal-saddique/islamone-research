import { SkeletonWithShimmer } from "~/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <SkeletonWithShimmer className="h-10 w-64 mb-2" />
          <SkeletonWithShimmer className="h-5 w-96" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <SkeletonWithShimmer className="h-5 w-32" />
                <SkeletonWithShimmer className="w-10 h-10 rounded-lg" />
              </div>
              <SkeletonWithShimmer className="h-8 w-20 mb-2" />
              <SkeletonWithShimmer className="h-4 w-24" />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <SkeletonWithShimmer className="h-7 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <SkeletonWithShimmer className="w-12 h-12 rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <SkeletonWithShimmer className="h-6 w-40 mb-2" />
                    <SkeletonWithShimmer className="h-4 w-full mb-1" />
                    <SkeletonWithShimmer className="h-4 w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <SkeletonWithShimmer className="h-7 w-48 mb-6" />
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-6">
                  <div className="flex items-start gap-4">
                    <SkeletonWithShimmer className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <SkeletonWithShimmer className="h-5 w-3/4 mb-2" />
                      <SkeletonWithShimmer className="h-4 w-1/2" />
                    </div>
                    <SkeletonWithShimmer className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
