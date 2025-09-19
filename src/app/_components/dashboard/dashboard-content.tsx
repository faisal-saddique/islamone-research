"use client";

import { useState } from "react";
import {
  BookOpen,
  BookMarked,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Settings,
  Bell,
  Calendar,
  Award,
  Target,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "~/app/_components/common/stat-card";
import { QuickActionCard } from "~/app/_components/common/quick-action-card";
import type { User } from "@prisma/client";

type AdminOverview = {
  type: "admin";
  totalUsers: number;
  activeReviewers: number;
  totalReviews: number;
  pendingFlags: number;
  todayReviews: number;
  todayApproved: number;
  completionPercentage: number;
};

type ModeratorOverview = {
  type: "moderator";
  pendingFlags: number;
  totalFlags: number;
  processedToday: number;
  userProgress: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    totalReviews: number;
    approvedReviews: number;
    flaggedReviews: number;
    currentStreak: number;
    longestStreak: number;
    lastReviewDate: Date | null;
    completedSurahs: unknown;
    reviewedAyahs: unknown;
    userId: string;
  } | null;
};

type ReviewerOverview = {
  type: "reviewer";
  userProgress: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    totalReviews: number;
    approvedReviews: number;
    flaggedReviews: number;
    currentStreak: number;
    longestStreak: number;
    lastReviewDate: Date | null;
    completedSurahs: unknown;
    reviewedAyahs: unknown;
    userId: string;
  } | null;
  recentReviews: unknown[];
};

type DashboardOverview = AdminOverview | ModeratorOverview | ReviewerOverview;

interface DashboardContentProps {
  overview: DashboardOverview;
  user: User;
}

export function DashboardContent({ overview, user }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "ADMIN": return { label: "Administrator", color: "error" as const };
      case "MODERATOR": return { label: "Moderator", color: "warning" as const };
      case "REVIEWER": return { label: "Reviewer", color: "success" as const };
      default: return { label: role, color: "primary" as const };
    }
  };

  const roleInfo = getRoleDisplay(user.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.displayName ?? user.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-gray-600">
                Here&apos;s what&apos;s happening with your Islamic research platform today.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-full text-sm font-medium text-white ${
                roleInfo.color === "error" ? "bg-red-500" :
                roleInfo.color === "warning" ? "bg-amber-500" :
                roleInfo.color === "success" ? "bg-emerald-500" :
                "bg-primary"
              }`}>
                <Award className="w-4 h-4 inline mr-1" />
                {roleInfo.label}
              </div>
              <button className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <Link href="/settings" className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 p-2 mb-8">
          <div className="flex space-x-1">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "activity", label: "Recent Activity", icon: Clock },
              { id: "progress", label: "Progress", icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overview.type === "admin" ? (
                <>
                  <StatCard
                    title="Total Users"
                    value={overview.totalUsers ?? 0}
                    subtitle="Active platform users"
                    icon={Users}
                    color="primary"
                  />
                  <StatCard
                    title="Active Reviewers"
                    value={overview.activeReviewers ?? 0}
                    subtitle="This week"
                    icon={CheckCircle}
                    color="success"
                  />
                  <StatCard
                    title="Total Reviews"
                    value={overview.totalReviews ?? 0}
                    subtitle="All time"
                    icon={BookMarked}
                  />
                  <StatCard
                    title="Pending Flags"
                    value={overview.pendingFlags ?? 0}
                    subtitle="Needs attention"
                    icon={Clock}
                    color="warning"
                  />
                </>
              ) : overview.type === "moderator" ? (
                <>
                  <StatCard
                    title="Pending Flags"
                    value={overview.pendingFlags}
                    subtitle="Awaiting review"
                    icon={Clock}
                    color="warning"
                  />
                  <StatCard
                    title="Total Flags"
                    value={overview.totalFlags}
                    subtitle="All flagged content"
                    icon={CheckCircle}
                    color="primary"
                  />
                  <StatCard
                    title="Processed Today"
                    value={overview.processedToday}
                    subtitle="Flags reviewed"
                    icon={Target}
                    color="success"
                  />
                  <StatCard
                    title="Your Reviews"
                    value={overview.userProgress?.totalReviews ?? 0}
                    subtitle="Total completed"
                    icon={Users}
                  />
                </>
              ) : (
                <>
                  <StatCard
                    title="Reviews Completed"
                    value={overview.userProgress?.totalReviews ?? 0}
                    subtitle="All time"
                    icon={CheckCircle}
                    color="success"
                  />
                  <StatCard
                    title="Accuracy Score"
                    value={`${Math.round((overview.userProgress?.approvedReviews ?? 0) / Math.max(overview.userProgress?.totalReviews ?? 1, 1) * 100)}%`}
                    subtitle="Review accuracy"
                    icon={Target}
                    color="primary"
                  />
                  <StatCard
                    title="Current Streak"
                    value={overview.userProgress?.currentStreak ?? 0}
                    subtitle="Days active"
                    icon={TrendingUp}
                  />
                  <StatCard
                    title="Pending Tasks"
                    value={0}
                    subtitle="Awaiting review"
                    icon={Clock}
                    color="warning"
                  />
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuickActionCard
                  title="Browse Quran"
                  description="Read and study the Holy Quran with translations and commentary"
                  icon={BookOpen}
                  href="/quran"
                  color="primary"
                />
                <QuickActionCard
                  title="Explore Hadith"
                  description="Access authentic Hadith collections from major compilers"
                  icon={BookMarked}
                  href="/hadith"
                  color="secondary"
                />
                {(user.role === "REVIEWER" || user.role === "MODERATOR" || user.role === "ADMIN") && (
                  <QuickActionCard
                    title="Review Content"
                    description="Continue your translation review work and earn points"
                    icon={CheckCircle}
                    href="/dashboard/review"
                    color="accent"
                  />
                )}
                {(user.role === "MODERATOR" || user.role === "ADMIN") && (
                  <QuickActionCard
                    title="Manage Users"
                    description="View and manage platform users and their roles"
                    icon={Users}
                    href="/dashboard/user-management"
                    color="secondary"
                  />
                )}
                {user.role === "ADMIN" && (
                  <QuickActionCard
                    title="Analytics"
                    description="View detailed platform analytics and performance metrics"
                    icon={BarChart3}
                    href="/dashboard/user-management"
                    color="accent"
                  />
                )}
                <QuickActionCard
                  title="Settings"
                  description="Manage your account preferences and notification settings"
                  icon={Settings}
                  href="/settings"
                  color="primary"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Recent Activity</h3>
              <p className="text-gray-600">
                Your recent activities will appear here. Start reviewing content to see your progress!
              </p>
            </div>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Detailed progress analytics and achievement tracking coming soon!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}