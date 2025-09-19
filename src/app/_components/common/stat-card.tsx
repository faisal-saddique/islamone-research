import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "primary" | "success" | "warning" | "error";
  trend?: {
    direction: "up" | "down";
    value: string;
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "primary",
  trend
}: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary text-white",
    success: "bg-emerald-500 text-white",
    warning: "bg-amber-500 text-white",
    error: "bg-red-500 text-white"
  };


  return (
    <div className={`rounded-2xl p-6 border border-gray-200 bg-white hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`text-sm font-medium ${
            trend.direction === "up" ? "text-emerald-600" : "text-red-600"
          }`}>
            {trend.direction === "up" ? "↑" : "↓"} {trend.value}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}