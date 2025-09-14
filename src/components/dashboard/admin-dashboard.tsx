"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import type { User } from "@prisma/client";

interface AdminDashboardProps {
  overview: {
    type: "admin";
    totalUsers: number;
    activeReviewers: number;
    totalReviews: number;
    pendingFlags: number;
    todayReviews: number;
    todayApproved: number;
    completionPercentage: number;
  };
  user: User;
}

export function AdminDashboard({ overview, user }: AdminDashboardProps) {
  const { data: flaggedTranslations } = api.dashboard.getFlaggedTranslations.useQuery({
    firebaseUid: user.firebaseUid,
  });

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Total Users</p>
              <p className="text-2xl font-semibold text-neutral-800">
                {overview.totalUsers}
              </p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Active Reviewers</p>
              <p className="text-2xl font-semibold text-neutral-800">
                {overview.activeReviewers}
              </p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Total Reviews</p>
              <p className="text-2xl font-semibold text-neutral-800">
                {overview.totalReviews}
              </p>
            </div>
            <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Pending Flags</p>
              <p className="text-2xl font-semibold text-neutral-800">
                {overview.pendingFlags}
              </p>
            </div>
            <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Activity */}
      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Today&apos;s Activity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">
              {overview.todayReviews}
            </p>
            <p className="text-sm text-neutral-500">Reviews Submitted</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-success">
              {overview.todayApproved}
            </p>
            <p className="text-sm text-neutral-500">Approved Translations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-warning">
              {overview.completionPercentage.toFixed(1)}%
            </p>
            <p className="text-sm text-neutral-500">Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/dashboard/user-management"
          className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 hover:bg-primary-subtle transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800">User Management</h3>
              <p className="text-sm text-neutral-500">Manage reviewers and roles</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/review-queue"
          className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 hover:bg-primary-subtle transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800">Review Queue</h3>
              <p className="text-sm text-neutral-500">Process flagged translations</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/assignments"
          className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 hover:bg-primary-subtle transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800">Surah Assignments</h3>
              <p className="text-sm text-neutral-500">Allocate content to reviewers</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Flagged Translations */}
      {flaggedTranslations && flaggedTranslations.length > 0 && (
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Recent Flagged Translations
          </h2>
          <div className="space-y-3">
            {flaggedTranslations.slice(0, 5).map((flag) => (
              <div
                key={flag.id}
                className="bg-neutral-100 rounded p-4 border border-neutral-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">
                      Surah {flag.surahNumber}, Ayah {flag.ayahNumber} - {flag.translationSource}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Flagged {flag.flagCount} time{flag.flagCount !== 1 ? 's' : ''} out of {flag.totalReviews} review{flag.totalReviews !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/review-queue?id=${flag.id}`}
                    className="px-3 py-1 bg-primary text-neutral-50 rounded text-xs hover:bg-primary-light transition-colors"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {flaggedTranslations.length > 5 && (
            <div className="mt-4 text-center">
              <Link
                href="/dashboard/review-queue"
                className="text-primary hover:text-primary-light text-sm"
              >
                View all flagged translations →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}