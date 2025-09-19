"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthContext } from "~/providers/auth-provider";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { useFont } from "~/contexts/font-context";
import { LoadingState } from "~/app/_components/common/loading-state";
import { ErrorState } from "~/app/_components/common/error-state";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  MessageSquare,
  Send,
  BookOpen,
  Target
} from "lucide-react";

function ReviewPageContent() {
  const { user, dbUser } = useAuthContext();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { getAyahText } = useFont();

  const surahParam = searchParams.get("surah");
  const ayahParam = searchParams.get("ayah");

  const [currentSurah, setCurrentSurah] = useState<number>(
    surahParam ? parseInt(surahParam) : 1
  );
  const [currentAyah, setCurrentAyah] = useState<number>(
    ayahParam ? parseInt(ayahParam) : 1
  );
  const [selectedTranslation, setSelectedTranslation] = useState<string>("");
  const [reviewStatus, setReviewStatus] = useState<"APPROVED" | "FLAGGED" | "NEEDS_REVIEW">("APPROVED");
  const [confidence, setConfidence] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>("");
  const [suggestedEdit, setSuggestedEdit] = useState<string>("");

  // Get assigned content
  const { data: assignedContent } = api.dashboard.getAssignedContent.useQuery(
    { firebaseUid: user?.uid ?? "" },
    { enabled: !!user?.uid }
  );

  // Get content for current review
  const { data: contentForReview, refetch: refetchContent } = api.dashboard.getContentForReview.useQuery(
    {
      surahNumber: currentSurah,
      ayahNumber: currentAyah,
      firebaseUid: user?.uid ?? "",
    },
    { enabled: !!user?.uid }
  );

  // Submit review mutation
  const submitReviewMutation = api.dashboard.submitReview.useMutation({
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      resetForm();
      // Move to next ayah
      if (contentForReview?.ayah && currentAyah < (assignedContent?.assignedSurahs.find(s => s.SurahNumber === currentSurah)?.AyahCount ?? 0)) {
        setCurrentAyah(currentAyah + 1);
      } else {
        // Move to next surah
        const currentSurahIndex = assignedContent?.assignedSurahs.findIndex(s => s.SurahNumber === currentSurah) ?? -1;
        if (currentSurahIndex !== -1 && currentSurahIndex < (assignedContent?.assignedSurahs.length ?? 0) - 1) {
          const nextSurah = assignedContent?.assignedSurahs[currentSurahIndex + 1];
          if (nextSurah) {
            setCurrentSurah(nextSurah.SurahNumber);
            setCurrentAyah(1);
          }
        }
      }
      void refetchContent();
    },
    onError: (error) => {
      toast.error(`Failed to submit review: ${error.message}`);
    },
  });

  const resetForm = () => {
    setSelectedTranslation("");
    setReviewStatus("APPROVED");
    setConfidence(5);
    setFeedback("");
    setSuggestedEdit("");
  };

  const handleSubmitReview = () => {
    if (!selectedTranslation || !contentForReview?.translations) {
      toast.error("Please select a translation to review");
      return;
    }

    if (!user?.uid) {
      toast.error("Authentication required");
      return;
    }

    const translationText = getTranslationText(selectedTranslation);
    if (!translationText) {
      toast.error("Selected translation not found");
      return;
    }

    submitReviewMutation.mutate({
      firebaseUid: user.uid,
      surahNumber: currentSurah,
      ayahNumber: currentAyah,
      translationSource: selectedTranslation,
      translationText,
      status: reviewStatus,
      confidence,
      feedback: feedback || undefined,
      suggestedEdit: suggestedEdit || undefined,
    });
  };

  const getTranslationText = (source: string): string => {
    if (!contentForReview?.translations) return "";
    const translations = contentForReview.translations as unknown as Record<string, string | null>;
    return translations[source] ?? "";
  };

  const availableTranslations = contentForReview?.translations ?
    Object.entries(contentForReview.translations)
      .filter(([key, value]) => value && key !== "Id" && key !== "SurahNumber" && key !== "AyahNumber")
      .map(([key, value]) => ({ key, value: value as string }))
    : [];

  const isReviewed = contentForReview?.existingReviews?.some(
    r => r.translationSource === selectedTranslation
  );

  if (!user || !dbUser) {
    return (
      <ErrorState
        title="Access Denied"
        description="Please sign in to access the review interface."
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
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Translation Review</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Review translations and provide feedback to improve accuracy
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Navigation Panel */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Navigation
              </h2>

              {/* Surah Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Surah
                </label>
                <select
                  value={currentSurah}
                  onChange={(e) => {
                    setCurrentSurah(parseInt(e.target.value));
                    setCurrentAyah(1);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                >
                  {assignedContent?.assignedSurahs.map((surah) => (
                    <option key={surah.Id} value={surah.SurahNumber}>
                      {surah.SurahNumber}. {surah.NameEnglish}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ayah Navigation */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ayah
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentAyah(Math.max(1, currentAyah - 1))}
                    disabled={currentAyah <= 1}
                    className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={currentAyah}
                    onChange={(e) => setCurrentAyah(parseInt(e.target.value) || 1)}
                    min="1"
                    max={assignedContent?.assignedSurahs.find(s => s.SurahNumber === currentSurah)?.AyahCount ?? 1}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center bg-white"
                  />
                  <button
                    onClick={() => setCurrentAyah(currentAyah + 1)}
                    disabled={currentAyah >= (assignedContent?.assignedSurahs.find(s => s.SurahNumber === currentSurah)?.AyahCount ?? 0)}
                    className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Info */}
              {assignedContent && (
                <div className="p-4 bg-primary-subtle rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Progress</div>
                  <div className="font-semibold text-gray-900">
                    {assignedContent.reviewedAyahs.filter(r => r.surahNumber === currentSurah).length} / {assignedContent.assignedSurahs.find(s => s.SurahNumber === currentSurah)?.AyahCount ?? 0}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">verses reviewed</div>
                </div>
              )}
            </div>
          </div>

          {/* Review Panel */}
          <div className="xl:col-span-3">
            {contentForReview ? (
              <div className="space-y-6">
                {/* Arabic Text */}
                {contentForReview.ayah && (
                  <div className="bg-white rounded-2xl p-8 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <BookOpen className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-semibold text-gray-900">
                        Surah {currentSurah}, Ayah {currentAyah}
                      </h3>
                    </div>
                    <div className="arabic-text text-3xl text-gray-800 leading-loose text-center p-6 bg-gray-50 rounded-lg">
                      {getAyahText(contentForReview.ayah)}
                    </div>
                  </div>
                )}

                {/* Translation Selection */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Select Translation to Review
                  </h3>
                  <div className="space-y-4">
                    {availableTranslations.map(({ key, value }) => (
                      <label
                        key={key}
                        className={`block p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                          selectedTranslation === key
                            ? "border-primary bg-primary-subtle"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="translation"
                          value={key}
                          checked={selectedTranslation === key}
                          onChange={(e) => setSelectedTranslation(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-2">{key}</p>
                            <p className="text-gray-700 leading-relaxed">{value}</p>
                          </div>
                          {contentForReview.existingReviews?.some(r => r.translationSource === key) && (
                            <span className="ml-4 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                              Reviewed
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Review Form */}
                {selectedTranslation && (
                  <div className="bg-white rounded-2xl p-8 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Review {selectedTranslation} Translation
                    </h3>

                    {/* Review Status */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Review Status
                      </label>
                      <div className="flex gap-3">
                        {[
                          { value: "APPROVED", label: "Approved", color: "emerald", icon: CheckCircle },
                          { value: "FLAGGED", label: "Flagged", color: "red", icon: AlertCircle },
                          { value: "NEEDS_REVIEW", label: "Needs Review", color: "amber", icon: Clock },
                        ].map(({ value, label, color, icon: Icon }) => (
                          <label key={value} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value={value}
                              checked={reviewStatus === value}
                              onChange={(e) => setReviewStatus(e.target.value as "APPROVED" | "FLAGGED" | "NEEDS_REVIEW")}
                              className="sr-only"
                            />
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                              reviewStatus === value
                                ? `border-${color}-400 bg-${color}-50 text-${color}-700`
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}>
                              <Icon className="w-4 h-4" />
                              <span className="font-medium">{label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Confidence Level */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Confidence Level: {confidence}/10
                      </label>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Low</span>
                        <div className="flex-1 relative">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={confidence}
                            onChange={(e) => setConfidence(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                              <span key={num}>{num}</span>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">High</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400" />
                          <span className="text-sm font-medium text-gray-700">{confidence}</span>
                        </div>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        <MessageSquare className="w-4 h-4 inline mr-1" />
                        Feedback (Optional)
                      </label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Provide feedback about the translation..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        rows={3}
                      />
                    </div>

                    {/* Suggested Edit */}
                    {reviewStatus === "FLAGGED" && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Suggested Correction
                        </label>
                        <textarea
                          value={suggestedEdit}
                          onChange={(e) => setSuggestedEdit(e.target.value)}
                          placeholder="Suggest a corrected translation..."
                          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                          rows={2}
                        />
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                      {isReviewed && (
                        <div className="flex items-center gap-2 text-amber-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">You have already reviewed this translation</span>
                        </div>
                      )}
                      <button
                        onClick={handleSubmitReview}
                        disabled={submitReviewMutation.isPending}
                        className="ml-auto flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        <Send className="w-4 h-4" />
                        {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 w-48 bg-gray-100 rounded mx-auto mb-2"></div>
                  <div className="h-4 w-32 bg-gray-100 rounded mx-auto"></div>
                </div>
                <p className="text-gray-500 mt-4">Loading content for review...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ReviewPageContent />
    </Suspense>
  );
}