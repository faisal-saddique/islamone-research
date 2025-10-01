"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthContext } from "~/providers/auth-provider";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { useFont } from "~/contexts/font-context";
import { ReviewPageSkeleton } from "~/components/skeletons/review-page-skeleton";
import { ErrorState } from "~/app/_components/common/error-state";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Star,
  MessageSquare,
  Send,
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
  const [confidence, setConfidence] = useState<number>(8);
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
    setConfidence(8);
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
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-semibold text-gray-800">Translation Review</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Review Quran translations for accuracy and authenticity. Your scholarly contributions help maintain the integrity of Islamic texts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Navigation Panel */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Navigation
              </h2>

              {/* Current Location */}
              <div className="mb-6 p-4 bg-primary-subtle rounded-lg text-center">
                <div className="text-lg font-semibold text-primary">
                  Surah {currentSurah} : Ayah {currentAyah}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {assignedContent?.assignedSurahs.find(s => s.SurahNumber === currentSurah)?.NameEnglish}
                </div>
              </div>

              {/* Quick Navigation */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick Jump to Ayah
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentAyah(Math.max(1, currentAyah - 1))}
                    disabled={currentAyah <= 1}
                    className="p-3 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    className="p-3 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Surah Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Change Surah
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

              {/* Progress Info */}
              {assignedContent && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Surah Progress</div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {assignedContent.reviewedAyahs.filter(r => r.surahNumber === currentSurah).length}
                    </span>
                    <span className="text-sm text-gray-500">of</span>
                    <span className="text-lg font-semibold text-gray-700">
                      {assignedContent.assignedSurahs.find(s => s.SurahNumber === currentSurah)?.AyahCount ?? 0}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">verses reviewed</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((assignedContent.reviewedAyahs.filter(r => r.surahNumber === currentSurah).length / (assignedContent.assignedSurahs.find(s => s.SurahNumber === currentSurah)?.AyahCount ?? 1)) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Review Panel */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            {contentForReview ? (
              <div className="space-y-6">
                {/* Arabic Text */}
                {contentForReview.ayah && (
                  <div className="bg-white rounded-2xl p-8 border border-gray-200">
                    <div className="text-center mb-6">
                      <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-semibold text-xs">{currentAyah}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Surah {currentSurah}, Ayah {currentAyah}
                      </h3>
                    </div>
                    <div className="arabic-text text-3xl md:text-4xl text-gray-800 leading-loose text-center p-8 bg-gray-50 rounded-lg">
                      {getAyahText(contentForReview.ayah)}
                    </div>
                  </div>
                )}

                {/* Translation Review Cards */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    Review Translations
                  </h3>
                  <div className="space-y-6">
                    {availableTranslations.map(({ key, value }) => {
                      // Check for known Urdu translation sources
                      const urduSources = ['maududi', 'jalandhary', 'junagarhi', 'taqi', 'ahmadRaza', 'urdu'];
                      const isUrdu = urduSources.some(source => key.toLowerCase().includes(source.toLowerCase())) ||
                                    key.toLowerCase().includes('urdu') ||
                                    key.toLowerCase().includes('اردو') ||
                                    /[\u0600-\u06FF\u0750-\u077F]/.test(value); // Contains Arabic/Urdu script
                      const isSelected = selectedTranslation === key;
                      const isReviewed = contentForReview.existingReviews?.some(r => r.translationSource === key);

                      return (
                        <div
                          key={key}
                          className={`border-2 rounded-xl transition-all ${
                            isSelected
                              ? "border-primary bg-primary-subtle shadow-lg"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                          }`}
                        >
                          {/* Translation Header */}
                          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name="translation"
                                    value={key}
                                    checked={isSelected}
                                    onChange={(e) => setSelectedTranslation(e.target.value)}
                                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                  />
                                  <span className="ml-2 font-semibold text-gray-900">{key}</span>
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                {isReviewed && (
                                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                    ✓ Reviewed
                                  </span>
                                )}
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                                }`}>
                                  {isSelected ? "Selected" : "Select"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Translation Text */}
                          <div className="p-6">
                            <div className={`text-lg leading-relaxed ${
                              isUrdu ? "urdu-text" : ""
                            } ${isSelected ? "text-gray-800" : "text-gray-700"}`}>
                              {value}
                            </div>
                          </div>

                          {/* Quick Review Actions - Only show for selected translation */}
                          {isSelected && (
                            <div className="p-4 border-t border-gray-200 bg-primary-subtle rounded-b-xl">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Quick Review:</span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setReviewStatus("APPROVED")}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                      reviewStatus === "APPROVED"
                                        ? "bg-emerald-500 text-white"
                                        : "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50"
                                    }`}
                                  >
                                    ✓ Approve
                                  </button>
                                  <button
                                    onClick={() => setReviewStatus("NEEDS_REVIEW")}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                      reviewStatus === "NEEDS_REVIEW"
                                        ? "bg-amber-500 text-white"
                                        : "bg-white text-amber-600 border border-amber-200 hover:bg-amber-50"
                                    }`}
                                  >
                                    ⚠ Needs Review
                                  </button>
                                  <button
                                    onClick={() => setReviewStatus("FLAGGED")}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                      reviewStatus === "FLAGGED"
                                        ? "bg-red-500 text-white"
                                        : "bg-white text-red-600 border border-red-200 hover:bg-red-50"
                                    }`}
                                  >
                                    ✕ Flag
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Review Form - Only show when needed */}
                {selectedTranslation && (reviewStatus !== "APPROVED" || feedback || confidence !== 8) && (
                  <div className="bg-white rounded-2xl p-8 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                      Detailed Review for {selectedTranslation}
                    </h3>

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
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #079489 0%, #079489 ${(confidence - 1) * 11.11}%, #e5e7eb ${(confidence - 1) * 11.11}%, #e5e7eb 100%)`
                            }}
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                              <span key={num}>{num}</span>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">High</span>
                        <div className="flex items-center gap-1 bg-primary-subtle px-3 py-1 rounded-lg">
                          <Star className="w-4 h-4 text-primary" />
                          <span className="text-sm font-bold text-primary">{confidence}</span>
                        </div>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        <MessageSquare className="w-4 h-4 inline mr-1" />
                        Additional Feedback (Optional)
                      </label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Share your thoughts about this translation..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        rows={3}
                      />
                    </div>

                    {/* Suggested Edit - Only for flagged content */}
                    {reviewStatus === "FLAGGED" && (
                      <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                        <label className="block text-sm font-medium text-red-700 mb-3">
                          Suggested Correction (Required for flagged content)
                        </label>
                        <textarea
                          value={suggestedEdit}
                          onChange={(e) => setSuggestedEdit(e.target.value)}
                          placeholder="Please provide a corrected version of the translation..."
                          className="w-full p-4 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          rows={2}
                          required
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Review Section */}
                {selectedTranslation && (
                  <div className="bg-white rounded-2xl p-8 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {isReviewed && (
                          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Previously reviewed</span>
                          </div>
                        )}
                        <div className="text-sm text-gray-600">
                          Review Status: <span className={`font-semibold ${
                            reviewStatus === "APPROVED" ? "text-emerald-600" :
                            reviewStatus === "NEEDS_REVIEW" ? "text-amber-600" :
                            "text-red-600"
                          }`}>
                            {reviewStatus === "APPROVED" ? "✓ Approved" :
                             reviewStatus === "NEEDS_REVIEW" ? "⚠ Needs Review" :
                             "✕ Flagged"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedTranslation("");
                            resetForm();
                          }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitReview}
                          disabled={submitReviewMutation.isPending || (reviewStatus === "FLAGGED" && !suggestedEdit)}
                          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                          <Send className="w-4 h-4" />
                          {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                        </button>
                      </div>
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
    <Suspense fallback={<ReviewPageSkeleton />}>
      <ReviewPageContent />
    </Suspense>
  );
}