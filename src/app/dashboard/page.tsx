"use client";

import { useAuthContext } from "~/providers/auth-provider";
import { api } from "~/trpc/react";
import { DashboardContent } from "~/app/_components/dashboard/dashboard-content";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardSkeleton } from "~/components/skeletons/dashboard-skeleton";
import { ErrorState } from "~/app/_components/common/error-state";

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
    return <DashboardSkeleton />;
  }

  if (!user || !dbUser) {
    return (
      <ErrorState
        title="Access Denied"
        description="Please sign in to access the dashboard."
        actionText="Sign In"
        onAction={() => router.push("/")}
      />
    );
  }

  if (!overview) {
    return (
      <ErrorState
        title="Error Loading Dashboard"
        description="Unable to load dashboard data. Please try again."
        actionText="Refresh"
        onAction={() => window.location.reload()}
      />
    );
  }

  return <DashboardContent overview={overview} user={dbUser} />;
}