"use client";

import { useAuthContext } from "~/providers/auth-provider";
import { api } from "~/trpc/react";
import { AdminDashboard } from "~/components/dashboard/admin-dashboard";
import { ModeratorDashboard } from "~/components/dashboard/moderator-dashboard";
import { ReviewerDashboard } from "~/components/dashboard/reviewer-dashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, dbUser, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const { data: overview, isLoading: overviewLoading } = api.dashboard.getOverview.useQuery(
    { firebaseUid: user?.uid ?? "" },
    { enabled: !!user?.uid }
  );

  if (isLoading || overviewLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-neutral-300 rounded mb-4"></div>
            <div className="h-4 w-96 bg-neutral-200 rounded mb-2"></div>
            <div className="h-4 w-72 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !dbUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 text-center">
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">
            Access Denied
          </h2>
          <p className="text-neutral-500">
            Please sign in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 text-center">
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-neutral-500">
            Unable to load dashboard data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
          Dashboard
        </h1>
        <p className="text-neutral-500">
          Welcome back, {dbUser.displayName ?? dbUser.email}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`px-2 py-1 rounded text-xs text-neutral-50 ${
              dbUser.role === "ADMIN"
                ? "bg-error"
                : dbUser.role === "MODERATOR"
                ? "bg-warning"
                : "bg-success"
            }`}
          >
            {dbUser.role}
          </span>
        </div>
      </div>

      {overview.type === "admin" && (
        <AdminDashboard overview={overview} user={dbUser} />
      )}
      {overview.type === "moderator" && (
        <ModeratorDashboard overview={overview} user={dbUser} />
      )}
      {overview.type === "reviewer" && (
        <ReviewerDashboard overview={overview} user={dbUser} />
      )}
    </div>
  );
}