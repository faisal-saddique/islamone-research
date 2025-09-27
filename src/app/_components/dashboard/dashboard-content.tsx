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
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">
              Welcome back, {user.displayName ?? user.email?.split('@')[0]}!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Continue your Quran translation review work and contribute to authentic Islamic scholarship.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className={`px-4 py-2 rounded-full text-sm font-medium text-white ${
                roleInfo.color === "error" ? "bg-red-500" :
                roleInfo.color === "warning" ? "bg-amber-500" :
                roleInfo.color === "success" ? "bg-emerald-500" :
                "bg-primary"
              }`}>
                <Award className="w-4 h-4 inline mr-1" />
                {roleInfo.label}
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <Link href="/settings" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-between items-center mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-2">
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

          <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
            {roleInfo.label} Dashboard
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
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(user.role === "REVIEWER" || user.role === "MODERATOR" || user.role === "ADMIN") && (
                  <QuickActionCard
                    title="Review Translations"
                    description="Continue your Quran translation review work"
                    icon={CheckCircle}
                    href="/dashboard/review"
                    color="primary"
                  />
                )}
                <QuickActionCard
                  title="Browse Quran"
                  description="Read and study the Holy Quran with translations"
                  icon={BookOpen}
                  href="/quran"
                  color="secondary"
                />
                <QuickActionCard
                  title="Explore Hadith"
                  description="Access authentic Hadith collections"
                  icon={BookMarked}
                  href="/hadith"
                  color="secondary"
                />
                {(user.role === "MODERATOR" || user.role === "ADMIN") && (
                  <QuickActionCard
                    title="Review Queue"
                    description="Manage flagged content and reviews"
                    icon={Users}
                    href="/dashboard/review-queue"
                    color="accent"
                  />
                )}
                {user.role === "ADMIN" && (
                  <QuickActionCard
                    title="User Management"
                    description="Manage platform users and permissions"
                    icon={BarChart3}
                    href="/dashboard/user-management"
                    color="accent"
                  />
                )}
                <QuickActionCard
                  title="Account Settings"
                  description="Manage your preferences and notifications"
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