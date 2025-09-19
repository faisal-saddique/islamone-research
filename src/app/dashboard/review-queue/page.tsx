"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthContext } from "~/providers/auth-provider";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { LoadingState } from "~/app/_components/common/loading-state";
import { ErrorState } from "~/app/_components/common/error-state";
import { StatCard } from "~/app/_components/common/stat-card";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit3,
  MessageSquare,
  Flag,
  Eye,
  Send,
  AlertCircle
} from "lucide-react";

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
      <ErrorState
        title="Access Denied"
        description="Admin or Moderator access required to view the review queue."
        actionText="Go to Dashboard"
        onAction={() => window.location.href = "/dashboard"}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Flag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Review Queue</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Process flagged translations and provide corrections
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Pending Reviews"
            value={flaggedTranslations?.length ?? 0}
            subtitle="Items to process"
            icon={AlertTriangle}
            color="warning"
          />
          <StatCard
            title="High Priority"
            value={flaggedTranslations?.filter(f => f.flagCount > f.totalReviews * 0.5).length ?? 0}
            subtitle="Over 50% flagged"
            icon={AlertCircle}
            color="error"
          />
          <StatCard
            title="Low Confidence"
            value={flaggedTranslations?.filter(f => f.averageConfidence < 5).length ?? 0}
            subtitle="Below 5.0 rating"
            icon={Eye}
            color="warning"
          />
          <StatCard
            title="Total Issues"
            value={flaggedTranslations?.reduce((sum, f) => sum + f.flagCount, 0) ?? 0}
            subtitle="All flags combined"
            icon={Flag}
            color="primary"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Flagged Translations List */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Pending Reviews</h2>
                <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  {flaggedTranslations?.length ?? 0} items
                </div>
              </div>

              {flaggedTranslations && flaggedTranslations.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {flaggedTranslations.map((flag) => {
                    const flagPercentage = (flag.flagCount / flag.totalReviews) * 100;
                    return (
                      <button
                        key={flag.id}
                        onClick={() => {
                          setSelectedTranslation(flag.id);
                          setCorrectedText(flag.originalText);
                          setAdminNotes("");
                          setDecision("");
                        }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                          selectedTranslation === flag.id
                            ? "border-primary bg-primary-subtle"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              Surah {flag.surahNumber}, Ayah {flag.ayahNumber}
                            </span>
                            {flagPercentage > 50 && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                            {flag.translationSource}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-xs text-gray-500">
                            <Flag className="w-3 h-3 inline mr-1" />
                            {flag.flagCount}/{flag.totalReviews} flags
                          </div>
                          <div className="text-xs text-gray-500">
                            <Eye className="w-3 h-3 inline mr-1" />
                            {flag.averageConfidence.toFixed(1)}/10
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                          {flag.originalText}
                        </p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No flagged translations pending review.</p>
                  <p className="text-sm text-gray-400 mt-1">Great job keeping up with reviews!</p>
                </div>
              )}
            </div>
          </div>

          {/* Review Details */}
          <div className="xl:col-span-2">
            {selectedFlag ? (
              <div className="space-y-6">
                {/* Translation Details */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Translation Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Reference</p>
                        <p className="text-lg font-semibold text-gray-900">
                          Surah {selectedFlag.surahNumber}, Ayah {selectedFlag.ayahNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Translation Source</p>
                        <p className="text-gray-900 font-medium">{selectedFlag.translationSource}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Flag Rate</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedFlag.flagCount} / {selectedFlag.totalReviews}
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            (selectedFlag.flagCount / selectedFlag.totalReviews) > 0.5
                              ? 'bg-red-100 text-red-700'
                              : (selectedFlag.flagCount / selectedFlag.totalReviews) > 0.3
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {((selectedFlag.flagCount / selectedFlag.totalReviews) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Average Confidence</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedFlag.averageConfidence.toFixed(1)}/10
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedFlag.averageConfidence >= 7
                              ? 'bg-green-100 text-green-700'
                              : selectedFlag.averageConfidence >= 5
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {selectedFlag.averageConfidence >= 7 ? 'High' :
                             selectedFlag.averageConfidence >= 5 ? 'Medium' : 'Low'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Original Translation</p>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-800 leading-relaxed">{selectedFlag.originalText}</p>
                    </div>
                  </div>

                  {/* Common Issues */}
                  {Array.isArray(selectedFlag.commonIssues) && selectedFlag.commonIssues.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-3">Common Issues Reported</p>
                      <div className="space-y-2">
                        {selectedFlag.commonIssues.map((issue, index) => (
                          <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm text-gray-700 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              &ldquo;{typeof issue === 'string' ? issue : JSON.stringify(issue)}&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Edits */}
                  {Array.isArray(selectedFlag.suggestedEdits) && selectedFlag.suggestedEdits.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Suggested Corrections</p>
                      <div className="space-y-2">
                        {selectedFlag.suggestedEdits.map((edit, index) => (
                          <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-gray-700 flex items-start gap-2">
                              <Edit3 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              &ldquo;{typeof edit === 'string' ? edit : JSON.stringify(edit)}&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Admin Decision */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Admin Decision</h3>

                  {/* Decision Options */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-4">Decision</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { value: "CONFIRMED", label: "Confirm Issue", color: "red", icon: XCircle, desc: "Issue is valid" },
                        { value: "REJECTED", label: "Reject Flags", color: "green", icon: CheckCircle, desc: "Translation is fine" },
                        { value: "CORRECTED", label: "Provide Correction", color: "blue", icon: Edit3, desc: "Fix the translation" },
                      ].map(({ value, label, color, icon: Icon, desc }) => (
                        <label key={value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="decision"
                            value={value}
                            checked={decision === value}
                            onChange={(e) => setDecision(e.target.value as typeof decision)}
                            className="sr-only"
                          />
                          <div className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                            decision === value
                              ? `border-${color}-400 bg-${color}-50`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className={`w-5 h-5 ${decision === value ? `text-${color}-600` : 'text-gray-400'}`} />
                              <span className={`font-medium ${decision === value ? `text-${color}-900` : 'text-gray-700'}`}>
                                {label}
                              </span>
                            </div>
                            <p className={`text-sm ${decision === value ? `text-${color}-700` : 'text-gray-500'}`}>
                              {desc}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Corrected Text */}
                  {decision === "CORRECTED" && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        <Edit3 className="w-4 h-4 inline mr-1" />
                        Corrected Translation
                      </label>
                      <textarea
                        value={correctedText}
                        onChange={(e) => setCorrectedText(e.target.value)}
                        placeholder="Enter the corrected translation..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        rows={4}
                      />
                    </div>
                  )}

                  {/* Admin Notes */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes about your decision..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                      onClick={handleProcessTranslation}
                      disabled={!decision || processTranslationMutation.isPending}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      <Send className="w-4 h-4" />
                      {processTranslationMutation.isPending ? "Processing..." : "Submit Decision"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
                <div className="py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a flagged translation to review</h3>
                  <p className="text-gray-600 mb-4">
                    Choose an item from the list to view details and make a decision
                  </p>
                  <p className="text-sm text-gray-500">
                    Review flagged content to maintain translation quality across the platform
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewQueuePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ReviewQueuePageContent />
    </Suspense>
  );
}