import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function ErrorState({ title, description, actionText, onAction }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
            <p className="text-gray-600 mb-6">{description}</p>
            {actionText && onAction && (
              <button
                onClick={onAction}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium"
              >
                {actionText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}