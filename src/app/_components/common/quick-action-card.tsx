import { type LucideIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: "primary" | "secondary" | "accent";
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  color = "primary"
}: QuickActionCardProps) {
  const colorClasses = {
    primary: "from-primary to-primary-light",
    secondary: "from-blue-500 to-blue-600",
    accent: "from-emerald-500 to-emerald-600"
  };

  return (
    <Link href={href} className="group">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}