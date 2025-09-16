"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthContext } from "~/providers/auth-provider";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { useFont } from "~/contexts/font-context";

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
      <div className="container mx-auto px-4 py-8">
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 text-center">
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">
            Access Denied
          </h2>
          <p className="text-neutral-500">
            Please sign in to access the review interface.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
          Translation Review
        </h1>
        <p className="text-neutral-500">
          Review translations and provide feedback to improve accuracy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Panel */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">
              Navigation
            </h2>
            
            {/* Surah Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Surah
              </label>
              <select
                value={currentSurah}
                onChange={(e) => {
                  setCurrentSurah(parseInt(e.target.value));
                  setCurrentAyah(1);
                }}
                className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {assignedContent?.assignedSurahs.map((surah) => (
                  <option key={surah.Id} value={surah.SurahNumber}>
                    {surah.SurahNumber}. {surah.NameEnglish}
                  </option>
                ))}
              </select>
            </div>

            {/* Ayah Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Ayah
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentAyah(Math.max(1, currentAyah - 1))}
                  disabled={currentAyah <= 1}
                  className="px-3 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <input
                  type="number"
                  value={currentAyah}
                  onChange={(e) => setCurrentAyah(parseInt(e.target.value) || 1)}
                  min="1"
                  max={assignedContent?.assignedSurahs.find(s => s.SurahNumber === currentSurah)?.AyahCount ?? 1}
                  className="flex-1 p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent text-center"
                />
                <button
                  onClick={() => setCurrentAyah(currentAyah + 1)}
                  disabled={currentAyah >= (assignedContent?.assignedSurahs.find(s => s.SurahNumber === currentSurah)?.AyahCount ?? 0)}
                  className="px-3 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            </div>

            {/* Progress Info */}
            {assignedContent && (
              <div className="text-sm text-neutral-500">
                <p>
                  Total reviewed: {assignedContent.reviewedAyahs.filter(r => r.surahNumber === currentSurah).length} / {assignedContent.assignedSurahs.find(s => s.SurahNumber === currentSurah)?.AyahCount ?? 0}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Review Panel */}
        <div className="lg:col-span-2">
          {contentForReview ? (
            <div className="space-y-6">
              {/* Arabic Text */}
              {contentForReview.ayah && (
                <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                    Surah {currentSurah}, Ayah {currentAyah}
                  </h3>
                  <div className="arabic-text text-2xl text-neutral-800 mb-4">
                    {getAyahText(contentForReview.ayah)}
                  </div>
                </div>
              )}

              {/* Translation Selection */}
              <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                  Select Translation to Review
                </h3>
                <div className="space-y-3">
                  {availableTranslations.map(({ key, value }) => (
                    <label
                      key={key}
                      className={`block p-4 border rounded cursor-pointer transition-colors ${
                        selectedTranslation === key
                          ? "border-primary bg-primary-subtle"
                          : "border-neutral-200 hover:border-neutral-300"
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
                          <p className="font-medium text-neutral-800 mb-1">{key}</p>
                          <p className="text-neutral-700">{value}</p>
                        </div>
                        {contentForReview.existingReviews?.some(r => r.translationSource === key) && (
                          <span className="ml-2 px-2 py-1 bg-success text-neutral-50 rounded text-xs">
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
                <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                    Review {selectedTranslation} Translation
                  </h3>

                  {/* Review Status */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Review Status
                    </label>
                    <div className="flex gap-3">
                      {[
                        { value: "APPROVED", label: "Approved", color: "success" },
                        { value: "FLAGGED", label: "Flagged", color: "error" },
                        { value: "NEEDS_REVIEW", label: "Needs Review", color: "warning" },
                      ].map(({ value, label, color }) => (
                        <label key={value} className="flex items-center">
                          <input
                            type="radio"
                            name="status"
                            value={value}
                            checked={reviewStatus === value}
                            onChange={(e) => setReviewStatus(e.target.value as "APPROVED" | "FLAGGED" | "NEEDS_REVIEW")}
                            className="mr-2"
                          />
                          <span className={`px-2 py-1 rounded text-xs text-neutral-50 bg-${color}`}>
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Confidence Level */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Confidence Level: {confidence}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={confidence}
                      onChange={(e) => setConfidence(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Feedback */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Feedback (Optional)
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide feedback about the translation..."
                      className="w-full p-3 border border-neutral-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  {/* Suggested Edit */}
                  {reviewStatus === "FLAGGED" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Suggested Correction
                      </label>
                      <textarea
                        value={suggestedEdit}
                        onChange={(e) => setSuggestedEdit(e.target.value)}
                        placeholder="Suggest a corrected translation..."
                        className="w-full p-3 border border-neutral-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows={2}
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-between items-center">
                    {isReviewed && (
                      <p className="text-sm text-warning">
                        You have already reviewed this translation
                      </p>
                    )}
                    <button
                      onClick={handleSubmitReview}
                      disabled={submitReviewMutation.isPending}
                      className="px-6 py-2 bg-primary text-neutral-50 rounded hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                    >
                      {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 text-center">
              <p className="text-neutral-500">
                Loading content for review...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-neutral-300 rounded mb-4"></div>
            <div className="h-4 w-96 bg-neutral-200 rounded mb-2"></div>
            <div className="h-4 w-72 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <ReviewPageContent />
    </Suspense>
  );
}