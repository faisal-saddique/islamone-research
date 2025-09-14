"use client";

import Link from "next/link";
import { useAuthContext } from "~/providers/auth-provider";
import { api } from "~/trpc/react";

export default function AssignmentsPage() {
  const { user, dbUser } = useAuthContext();

  const { data: assignedContent } = api.dashboard.getAssignedContent.useQuery(
    { firebaseUid: user?.uid ?? "" },
    { enabled: !!user?.uid }
  );

  if (!user || !dbUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 text-center">
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">
            Access Denied
          </h2>
          <p className="text-neutral-500">
            Please sign in to view your assignments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
          Your Assignments
        </h1>
        <p className="text-neutral-500">
          View your assigned content and track your progress
        </p>
      </div>

      {assignedContent ? (
        <div className="space-y-8">
          {/* Progress Overview */}
          {assignedContent.progress && (
            <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                Overall Progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-primary">
                    {assignedContent.progress.totalReviews}
                  </p>
                  <p className="text-sm text-neutral-500">Total Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-success">
                    {assignedContent.progress.approvedReviews}
                  </p>
                  <p className="text-sm text-neutral-500">Approved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-warning">
                    {assignedContent.progress.currentStreak}
                  </p>
                  <p className="text-sm text-neutral-500">Current Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-error">
                    {assignedContent.progress.longestStreak}
                  </p>
                  <p className="text-sm text-neutral-500">Best Streak</p>
                </div>
              </div>
            </div>
          )}

          {/* Assigned Surahs */}
          <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-neutral-800">
                Assigned Surahs
              </h2>
              <span className="px-3 py-1 bg-primary text-neutral-50 rounded text-sm">
                {assignedContent.assignedSurahs.length} surahs assigned
              </span>
            </div>

            {assignedContent.assignedSurahs.length > 0 ? (
              <div className="grid gap-4">
                {assignedContent.assignedSurahs.map((surah) => {
                  // Calculate progress for this surah
                  const reviewedInThisSurah = assignedContent.reviewedAyahs.filter(
                    r => r.surahNumber === surah.SurahNumber
                  );
                  const uniqueAyahsReviewed = new Set(
                    reviewedInThisSurah.map(r => r.ayahNumber)
                  ).size;
                  const totalAyahs = surah.AyahCount;
                  const progressPercentage = (uniqueAyahsReviewed / totalAyahs) * 100;

                  return (
                    <div
                      key={surah.Id}
                      className="bg-neutral-100 rounded-lg p-6 border border-neutral-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary text-neutral-50 rounded-full flex items-center justify-center text-lg font-semibold">
                            {surah.SurahNumber}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-neutral-800">
                              {surah.NameEnglish}
                            </h3>
                            <p className="text-neutral-500">{surah.NameMeaning}</p>
                            <p className="text-sm text-neutral-400">
                              {surah.AyahCount} verses • {surah.Type}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl text-neutral-800 font-medium mb-1">
                            {surah.NameArabic}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            progressPercentage === 100 
                              ? 'bg-success text-neutral-50' 
                              : progressPercentage > 0 
                              ? 'bg-warning text-neutral-800' 
                              : 'bg-neutral-300 text-neutral-700'
                          }`}>
                            {progressPercentage === 100 
                              ? 'Completed' 
                              : progressPercentage > 0 
                              ? 'In Progress' 
                              : 'Not Started'}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-neutral-600 mb-2">
                          <span>Progress</span>
                          <span>
                            {uniqueAyahsReviewed} / {totalAyahs} verses reviewed
                            ({reviewedInThisSurah.length} total reviews)
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-3">
                          <div
                            className="bg-primary h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                          {progressPercentage.toFixed(1)}% complete
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Link
                          href={`/dashboard/review?surah=${surah.SurahNumber}`}
                          className="px-4 py-2 bg-primary text-neutral-50 rounded hover:bg-primary-light transition-colors text-sm"
                        >
                          {progressPercentage > 0 ? 'Continue' : 'Start'} Reviewing
                        </Link>
                        <Link
                          href={`/quran/${surah.SurahNumber}`}
                          className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition-colors text-sm"
                        >
                          Read Surah
                        </Link>
                      </div>

                      {/* Recent Activity */}
                      {reviewedInThisSurah.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-neutral-200">
                          <p className="text-sm text-neutral-600 mb-2">Recent Reviews:</p>
                          <div className="flex flex-wrap gap-1">
                            {reviewedInThisSurah
                              .slice(-10) // Show last 10 reviews
                              .map((review, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-neutral-200 text-neutral-600 rounded text-xs"
                                >
                                  {review.ayahNumber}:{review.translationSource.substring(0, 3)}
                                </span>
                              ))}
                            {reviewedInThisSurah.length > 10 && (
                              <span className="px-2 py-1 bg-neutral-300 text-neutral-500 rounded text-xs">
                                +{reviewedInThisSurah.length - 10} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  No Assignments Yet
                </h3>
                <p className="text-neutral-500 mb-4">
                  You haven&apos;t been assigned any content to review yet.
                </p>
                <p className="text-sm text-neutral-400">
                  Contact an administrator to get started with translation reviews.
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/review"
                className="p-4 bg-primary text-neutral-50 rounded-lg hover:bg-primary-light transition-colors text-center"
              >
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="font-medium">Start Reviewing</p>
                <p className="text-sm opacity-90">Begin reviewing translations</p>
              </Link>
              
              <Link
                href="/dashboard"
                className="p-4 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors text-center"
              >
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                </svg>
                <p className="font-medium">Dashboard</p>
                <p className="text-sm">View your dashboard</p>
              </Link>
              
              <Link
                href="/quran"
                className="p-4 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors text-center"
              >
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="font-medium">Browse Quran</p>
                <p className="text-sm">Read the Holy Quran</p>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 text-center">
          <p className="text-neutral-500">Loading your assignments...</p>
        </div>
      )}
    </div>
  );
}