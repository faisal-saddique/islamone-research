"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import type { User, UserProgress } from "@prisma/client";

interface ModeratorDashboardProps {
  overview: {
    type: "moderator";
    pendingFlags: number;
    totalFlags: number;
    processedToday: number;
    userProgress: UserProgress | null;
  };
  user: User;
}

export function ModeratorDashboard({ overview, user }: ModeratorDashboardProps) {
  const { data: flaggedTranslations } = api.dashboard.getFlaggedTranslations.useQuery({
    firebaseUid: user.firebaseUid,
  });

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Total Flags</p>
              <p className="text-2xl font-semibold text-neutral-800">
                {overview.totalFlags}
              </p>
            </div>
            <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Processed Today</p>
              <p className="text-2xl font-semibold text-neutral-800">
                {overview.processedToday}
              </p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Progress */}
      {overview.userProgress && (
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Your Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-primary">
                {overview.userProgress.totalReviews}
              </p>
              <p className="text-sm text-neutral-500">Total Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-success">
                {overview.userProgress.approvedReviews}
              </p>
              <p className="text-sm text-neutral-500">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-error">
                {overview.userProgress.flaggedReviews}
              </p>
              <p className="text-sm text-neutral-500">Flagged</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-warning">
                {overview.userProgress.currentStreak}
              </p>
              <p className="text-sm text-neutral-500">Current Streak</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              {overview.pendingFlags > 0 && (
                <span className="inline-block px-2 py-1 bg-error text-neutral-50 rounded text-xs mt-1">
                  {overview.pendingFlags} pending
                </span>
              )}
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/review"
          className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 hover:bg-primary-subtle transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800">Continue Reviewing</h3>
              <p className="text-sm text-neutral-500">Review translations and content</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Flagged Translations Queue */}
      {flaggedTranslations && flaggedTranslations.length > 0 && (
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Flagged Translations Queue
          </h2>
          <div className="space-y-3">
            {flaggedTranslations.slice(0, 10).map((flag) => (
              <div
                key={flag.id}
                className="bg-neutral-100 rounded p-4 border border-neutral-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <p className="text-sm font-medium text-neutral-800">
                        Surah {flag.surahNumber}, Ayah {flag.ayahNumber}
                      </p>
                      <span className="px-2 py-1 bg-neutral-200 rounded text-xs text-neutral-600">
                        {flag.translationSource}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">
                      Flagged {flag.flagCount} time{flag.flagCount !== 1 ? 's' : ''} out of {flag.totalReviews} review{flag.totalReviews !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-neutral-700 line-clamp-2">
                      {flag.originalText}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/review-queue?id=${flag.id}`}
                    className="px-3 py-1 bg-primary text-neutral-50 rounded text-xs hover:bg-primary-light transition-colors ml-4"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {flaggedTranslations.length === 0 && (
            <p className="text-center text-neutral-500 py-8">
              No flagged translations pending review.
            </p>
          )}
        </div>
      )}
    </div>
  );
}