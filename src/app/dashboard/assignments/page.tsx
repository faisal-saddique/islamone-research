"use client";

import Link from "next/link";
import { useAuthContext } from "~/providers/auth-provider";
import { api } from "~/trpc/react";
import { LoadingState } from "~/app/_components/common/loading-state";
import { ErrorState } from "~/app/_components/common/error-state";
import { StatCard } from "~/app/_components/common/stat-card";
import { QuickActionCard } from "~/app/_components/common/quick-action-card";
import { CheckCircle, TrendingUp, BookOpen, Play, ArrowRight, Calendar } from "lucide-react";

export default function AssignmentsPage() {
  const { user, dbUser } = useAuthContext();

  const { data: assignedContent, isLoading } = api.dashboard.getAssignedContent.useQuery(
    { firebaseUid: user?.uid ?? "" },
    { enabled: !!user?.uid }
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (!user || !dbUser) {
    return (
      <ErrorState
        title="Access Denied"
        description="Please sign in to view your assignments."
        actionText="Sign In"
        onAction={() => window.location.href = "/"}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Your Assignments</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Track your progress and continue your translation review work
          </p>
        </div>

        {assignedContent ? (
          <div className="space-y-8">
            {/* Progress Stats */}
            {assignedContent.progress && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Reviews"
                  value={assignedContent.progress.totalReviews}
                  subtitle="All time"
                  icon={CheckCircle}
                  color="primary"
                />
                <StatCard
                  title="Approved Reviews"
                  value={assignedContent.progress.approvedReviews}
                  subtitle="Quality score"
                  icon={CheckCircle}
                  color="success"
                />
                <StatCard
                  title="Current Streak"
                  value={assignedContent.progress.currentStreak}
                  subtitle="Days active"
                  icon={TrendingUp}
                  color="warning"
                />
                <StatCard
                  title="Best Streak"
                  value={assignedContent.progress.longestStreak}
                  subtitle="Personal record"
                  icon={TrendingUp}
                  color="error"
                />
              </div>
            )}

            {/* Assigned Surahs */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Assigned Surahs</h2>
                <div className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
                  {assignedContent.assignedSurahs.length} surahs assigned
                </div>
              </div>

              {assignedContent.assignedSurahs.length > 0 ? (
                <div className="grid gap-6">
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
                        className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-lg font-bold text-white">
                              {surah.SurahNumber}
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                {surah.NameEnglish}
                              </h3>
                              <p className="text-gray-600 mb-1">{surah.NameMeaning}</p>
                              <p className="text-sm text-gray-500">
                                {surah.AyahCount} verses • {surah.Type}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="arabic-text text-2xl text-primary font-medium mb-2">
                              {surah.NameArabic}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              progressPercentage === 100
                                ? 'bg-emerald-100 text-emerald-700'
                                : progressPercentage > 0
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-gray-100 text-gray-700'
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
                        <div className="mb-6">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span className="font-medium">Progress</span>
                            <span>
                              {uniqueAyahsReviewed} / {totalAyahs} verses
                              ({reviewedInThisSurah.length} reviews)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-primary to-primary-light h-3 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            />
                          </div>
                          <div className="text-sm font-medium text-primary mt-2">
                            {progressPercentage.toFixed(1)}% complete
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-4">
                          <Link
                            href={`/dashboard/review?surah=${surah.SurahNumber}`}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium"
                          >
                            <Play className="w-4 h-4" />
                            {progressPercentage > 0 ? 'Continue' : 'Start'} Reviewing
                          </Link>
                          <Link
                            href={`/quran/${surah.SurahNumber}`}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                          >
                            <BookOpen className="w-4 h-4" />
                            Read Surah
                          </Link>
                        </div>

                        {/* Recent Activity */}
                        {reviewedInThisSurah.length > 0 && (
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-3">Recent Reviews:</p>
                            <div className="flex flex-wrap gap-2">
                              {reviewedInThisSurah
                                .slice(-8)
                                .map((review, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-white text-gray-600 rounded-lg text-sm font-medium border border-gray-200"
                                  >
                                    {review.ayahNumber}:{review.translationSource.substring(0, 3)}
                                  </span>
                                ))}
                              {reviewedInThisSurah.length > 8 && (
                                <span className="px-3 py-1 bg-gray-200 text-gray-500 rounded-lg text-sm font-medium">
                                  +{reviewedInThisSurah.length - 8} more
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
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Assignments Yet
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    You haven&apos;t been assigned any content to review yet. Contact an administrator to get started with translation reviews.
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickActionCard
                  title="Start Reviewing"
                  description="Begin reviewing translations and earn progress points"
                  icon={CheckCircle}
                  href="/dashboard/review"
                  color="primary"
                />
                <QuickActionCard
                  title="Dashboard"
                  description="View your complete dashboard and statistics"
                  icon={TrendingUp}
                  href="/dashboard"
                  color="secondary"
                />
                <QuickActionCard
                  title="Browse Quran"
                  description="Read and study the Holy Quran with translations"
                  icon={BookOpen}
                  href="/quran"
                  color="accent"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4"></div>
              <div className="h-4 w-48 bg-gray-100 rounded mx-auto mb-2"></div>
              <div className="h-4 w-32 bg-gray-100 rounded mx-auto"></div>
            </div>
            <p className="text-gray-500 mt-4">Loading your assignments...</p>
          </div>
        )}
      </div>
    </div>
  );
}