"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import type { User, UserProgress, TranslationReview } from "@prisma/client";

interface ReviewerDashboardProps {
  overview: {
    type: "reviewer";
    userProgress: UserProgress | null;
    recentReviews: (TranslationReview & { user: User })[];
  };
  user: User;
}

export function ReviewerDashboard({ overview, user }: ReviewerDashboardProps) {
  const { data: assignedContent } = api.dashboard.getAssignedContent.useQuery({
    firebaseUid: user.firebaseUid,
  });

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
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
              <p className="text-2xl font-semibold text-warning">
                {overview.userProgress.currentStreak}
              </p>
              <p className="text-sm text-neutral-500">Current Streak</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-error">
                {overview.userProgress.longestStreak}
              </p>
              <p className="text-sm text-neutral-500">Best Streak</p>
            </div>
          </div>
          
          {overview.userProgress.lastReviewDate && (
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-500">
                Last review: {new Date(overview.userProgress.lastReviewDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <h3 className="font-semibold text-neutral-800">Start Reviewing</h3>
              <p className="text-sm text-neutral-500">Review translations and provide feedback</p>
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
              <h3 className="font-semibold text-neutral-800">View Assignments</h3>
              <p className="text-sm text-neutral-500">See your assigned surahs and progress</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Assigned Content */}
      {assignedContent && (
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Your Assigned Content
          </h2>
          
          {assignedContent.assignedSurahs.length > 0 ? (
            <div className="grid gap-3">
              {assignedContent.assignedSurahs.map((surah) => {
                // Calculate progress for this surah
                const reviewedInThisSurah = assignedContent.reviewedAyahs.filter(
                  r => r.surahNumber === surah.SurahNumber
                ).length;
                const totalAyahs = surah.AyahCount;
                const progressPercentage = (reviewedInThisSurah / totalAyahs) * 100;

                return (
                  <div
                    key={surah.Id}
                    className="bg-neutral-100 rounded p-4 border border-neutral-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary text-neutral-50 rounded-full flex items-center justify-center text-sm font-semibold">
                          {surah.SurahNumber}
                        </div>
                        <div>
                          <h3 className="font-medium text-neutral-800">
                            {surah.NameEnglish}
                          </h3>
                          <p className="text-sm text-neutral-500">
                            {surah.NameMeaning}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="arabic-text text-lg text-neutral-800 font-medium">
                          {surah.NameArabic}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {surah.AyahCount} verses
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-neutral-500 mb-1">
                        <span>Progress</span>
                        <span>{reviewedInThisSurah} / {totalAyahs} verses reviewed</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
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
                      <Link
                        href={`/dashboard/review?surah=${surah.SurahNumber}`}
                        className="px-3 py-1 bg-primary text-neutral-50 rounded text-xs hover:bg-primary-light transition-colors"
                      >
                        {progressPercentage > 0 ? 'Continue' : 'Start'} Review
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-neutral-500 py-8">
              No content assigned yet. Please contact an administrator.
            </p>
          )}
        </div>
      )}

      {/* Recent Reviews */}
      {overview.recentReviews && overview.recentReviews.length > 0 && (
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Recent Reviews
          </h2>
          <div className="space-y-3">
            {overview.recentReviews.map((review) => (
              <div
                key={review.id}
                className="bg-neutral-100 rounded p-4 border border-neutral-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <p className="text-sm font-medium text-neutral-800">
                        Surah {review.surahNumber}, Ayah {review.ayahNumber}
                      </p>
                      <span className="px-2 py-1 bg-neutral-200 rounded text-xs text-neutral-600">
                        {review.translationSource}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        review.status === 'APPROVED' 
                          ? 'bg-success text-neutral-50'
                          : review.status === 'FLAGGED'
                          ? 'bg-error text-neutral-50'
                          : 'bg-warning text-neutral-800'
                      }`}>
                        {review.status.toLowerCase().replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-1">
                      Reviewed {new Date(review.reviewedAt).toLocaleDateString()} • Confidence: {review.confidence}/10
                    </p>
                    {review.feedback && (
                      <p className="text-sm text-neutral-600">
                        &quot;{review.feedback}&quot;
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}