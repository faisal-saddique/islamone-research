"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthContext } from "~/providers/auth-provider";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";

function ReviewQueuePageContent() {
  const { user, dbUser } = useAuthContext();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const focusedId = searchParams.get("id");

  const [selectedTranslation, setSelectedTranslation] = useState<string | null>(focusedId);
  const [adminNotes, setAdminNotes] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [decision, setDecision] = useState<"CONFIRMED" | "REJECTED" | "CORRECTED" | "">("");

  const { data: flaggedTranslations, refetch } = api.dashboard.getFlaggedTranslations.useQuery(
    { firebaseUid: user?.uid ?? "" },
    { enabled: !!user?.uid && (dbUser?.role === "ADMIN" || dbUser?.role === "MODERATOR") }
  );

  const processTranslationMutation = api.dashboard.processFlaggedTranslation.useMutation({
    onSuccess: () => {
      toast.success("Translation processed successfully!");
      setSelectedTranslation(null);
      setAdminNotes("");
      setCorrectedText("");
      setDecision("");
      void refetch();
    },
    onError: (error) => {
      toast.error(`Failed to process translation: ${error.message}`);
    },
  });

  const handleProcessTranslation = () => {
    if (!selectedTranslation || !decision || !user?.uid) {
      toast.error("Please select a decision");
      return;
    }

    processTranslationMutation.mutate({
      firebaseUid: user.uid,
      flaggedTranslationId: selectedTranslation,
      decision,
      adminNotes: adminNotes || undefined,
      correctedText: correctedText || undefined,
    });
  };

  const selectedFlag = flaggedTranslations?.find(f => f.id === selectedTranslation);

  if (!user || !dbUser || (dbUser.role !== "ADMIN" && dbUser.role !== "MODERATOR")) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 text-center">
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">
            Access Denied
          </h2>
          <p className="text-neutral-500">
            Admin or Moderator access required to view the review queue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
          Review Queue
        </h1>
        <p className="text-neutral-500">
          Process flagged translations and provide corrections
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Flagged Translations List */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-neutral-800">
                Pending Reviews
              </h2>
              <span className="px-2 py-1 bg-error text-neutral-50 rounded text-xs">
                {flaggedTranslations?.length ?? 0} items
              </span>
            </div>

            {flaggedTranslations && flaggedTranslations.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {flaggedTranslations.map((flag) => (
                  <button
                    key={flag.id}
                    onClick={() => {
                      setSelectedTranslation(flag.id);
                      setCorrectedText(flag.originalText);
                      setAdminNotes("");
                      setDecision("");
                    }}
                    className={`w-full text-left p-4 rounded border transition-colors ${
                      selectedTranslation === flag.id
                        ? "border-primary bg-primary-subtle"
                        : "border-neutral-200 hover:border-neutral-300 bg-neutral-100"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium text-neutral-800">
                        Surah {flag.surahNumber}, Ayah {flag.ayahNumber}
                      </p>
                      <span className="px-2 py-1 bg-warning text-neutral-800 rounded text-xs">
                        {flag.translationSource}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">
                      Flagged {flag.flagCount} / {flag.totalReviews} times
                    </p>
                    <p className="text-sm text-neutral-700 line-clamp-2">
                      {flag.originalText}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-500 py-8">
                No flagged translations pending review.
              </p>
            )}
          </div>
        </div>

        {/* Review Details */}
        <div className="lg:col-span-2">
          {selectedFlag ? (
            <div className="space-y-6">
              {/* Translation Details */}
              <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                  Translation Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Reference</p>
                    <p className="text-neutral-800">
                      Surah {selectedFlag.surahNumber}, Ayah {selectedFlag.ayahNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Translation Source</p>
                    <p className="text-neutral-800">{selectedFlag.translationSource}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Flag Rate</p>
                    <p className="text-neutral-800">
                      {selectedFlag.flagCount} out of {selectedFlag.totalReviews} reviews 
                      ({((selectedFlag.flagCount / selectedFlag.totalReviews) * 100).toFixed(1)}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Average Confidence</p>
                    <p className="text-neutral-800">
                      {selectedFlag.averageConfidence.toFixed(1)}/10
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-neutral-700 mb-2">Original Translation</p>
                  <div className="p-3 bg-neutral-100 rounded border">
                    <p className="text-neutral-800">{selectedFlag.originalText}</p>
                  </div>
                </div>

                {/* Common Issues */}
                {Array.isArray(selectedFlag.commonIssues) && selectedFlag.commonIssues.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-neutral-700 mb-2">Common Issues Reported</p>
                    <div className="space-y-2">
                      {selectedFlag.commonIssues.map((issue, index) => (
                        <div key={index} className="p-2 bg-error/10 rounded border border-error/20">
                          <p className="text-sm text-neutral-700">&quot;{typeof issue === 'string' ? issue : JSON.stringify(issue)}&quot;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Edits */}
                {Array.isArray(selectedFlag.suggestedEdits) && selectedFlag.suggestedEdits.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-neutral-700 mb-2">Suggested Corrections</p>
                    <div className="space-y-2">
                      {selectedFlag.suggestedEdits.map((edit, index) => (
                        <div key={index} className="p-2 bg-success/10 rounded border border-success/20">
                          <p className="text-sm text-neutral-700">&quot;{typeof edit === 'string' ? edit : JSON.stringify(edit)}&quot;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Decision */}
              <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                  Admin Decision
                </h3>

                {/* Decision Options */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-neutral-700 mb-2">Decision</p>
                  <div className="flex gap-3">
                    {[
                      { value: "CONFIRMED", label: "Confirm Issue", color: "error" },
                      { value: "REJECTED", label: "Reject Flags", color: "success" },
                      { value: "CORRECTED", label: "Provide Correction", color: "primary" },
                    ].map(({ value, label, color }) => (
                      <label key={value} className="flex items-center">
                        <input
                          type="radio"
                          name="decision"
                          value={value}
                          checked={decision === value}
                          onChange={(e) => setDecision(e.target.value as typeof decision)}
                          className="mr-2"
                        />
                        <span className={`px-2 py-1 rounded text-xs text-neutral-50 bg-${color}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Corrected Text */}
                {decision === "CORRECTED" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Corrected Translation
                    </label>
                    <textarea
                      value={correctedText}
                      onChange={(e) => setCorrectedText(e.target.value)}
                      placeholder="Enter the corrected translation..."
                      className="w-full p-3 border border-neutral-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={3}
                    />
                  </div>
                )}

                {/* Admin Notes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about your decision..."
                    className="w-full p-3 border border-neutral-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleProcessTranslation}
                    disabled={!decision || processTranslationMutation.isPending}
                    className="px-6 py-2 bg-primary text-neutral-50 rounded hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processTranslationMutation.isPending ? "Processing..." : "Submit Decision"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 text-center">
              <div className="py-12">
                <svg className="w-12 h-12 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="text-neutral-500 mb-2">Select a flagged translation to review</p>
                <p className="text-sm text-neutral-400">
                  Choose an item from the list to view details and make a decision
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewQueuePage() {
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
      <ReviewQueuePageContent />
    </Suspense>
  );
}