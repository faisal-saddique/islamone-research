"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuthContext } from "~/providers/auth-provider";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { LoadingState } from "~/app/_components/common/loading-state";
import { ErrorState } from "~/app/_components/common/error-state";
import { StatCard } from "~/app/_components/common/stat-card";
import type { UserRole } from "@prisma/client";
import {
  Users,
  Shield,
  Search,
  Filter,
  Calendar,
  Award,
  Settings,
  CheckCircle,
  XCircle,
  Crown,
  Star,
  TrendingUp,
} from "lucide-react";

export default function UserManagementPage() {
  const { user, dbUser } = useAuthContext();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "role" | "activity">("activity");

  const { data: allUsers, refetch, isLoading } = api.dashboard.getAllUsers.useQuery(
    { firebaseUid: user?.uid ?? "" },
    { enabled: !!user?.uid && dbUser?.role === "ADMIN" }
  );

  const updateRoleMutation = api.dashboard.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("User role updated successfully!");
      void refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update user role: ${error.message}`);
    },
  });

  const handleRoleUpdate = (targetUserId: string, newRole: UserRole) => {
    if (!user?.uid) return;

    updateRoleMutation.mutate({
      adminFirebaseUid: user.uid,
      targetUserId,
      newRole,
    });
  };

  const filteredUsers = allUsers?.filter((user) => {
    const matchesSearch = !searchTerm ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesRole = !selectedRole || user.role === selectedRole;

    return matchesSearch && matchesRole;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name":
        const nameA = a.displayName ?? a.email;
        const nameB = b.displayName ?? b.email;
        return nameA.localeCompare(nameB);
      case "role":
        const roleOrder = { "ADMIN": 1, "MODERATOR": 2, "REVIEWER": 3 };
        return (roleOrder[a.role] ?? 4) - (roleOrder[b.role] ?? 4);
      case "activity":
        const lastLoginA = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
        const lastLoginB = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
        return lastLoginB - lastLoginA;
      default:
        return 0;
    }
  }) ?? [];

  if (isLoading) {
    return <LoadingState />;
  }

  if (!user || !dbUser || dbUser.role !== "ADMIN") {
    return (
      <ErrorState
        title="Access Denied"
        description="Admin access required to view user management."
        actionText="Go to Dashboard"
        onAction={() => window.location.href = "/dashboard"}
      />
    );
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "ADMIN": return "from-red-500 to-red-600";
      case "MODERATOR": return "from-amber-500 to-amber-600";
      case "REVIEWER": return "from-emerald-500 to-emerald-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "ADMIN": return Crown;
      case "MODERATOR": return Shield;
      case "REVIEWER": return Star;
      default: return Users;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-subtle/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 text-lg">
                  Manage user roles and permissions across the platform
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="text-sm text-gray-500">
                Total Users: <span className="font-semibold text-gray-900">{allUsers?.length ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Search className="w-4 h-4 inline mr-2" />
                Search Users
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Filter className="w-4 h-4 inline mr-2" />
                Filter by Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole | "")}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all duration-200"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="MODERATOR">Moderator</option>
                <option value="REVIEWER">Reviewer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "role" | "activity")}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all duration-200"
              >
                <option value="activity">Recent Activity</option>
                <option value="name">Name</option>
                <option value="role">Role</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={allUsers?.length ?? 0}
            subtitle="All platform users"
            icon={Users}
            color="primary"
          />
          <StatCard
            title="Admins"
            value={allUsers?.filter(u => u.role === "ADMIN").length ?? 0}
            subtitle="Platform administrators"
            icon={Crown}
            color="error"
          />
          <StatCard
            title="Moderators"
            value={allUsers?.filter(u => u.role === "MODERATOR").length ?? 0}
            subtitle="Content moderators"
            icon={Shield}
            color="warning"
          />
          <StatCard
            title="Active Users"
            value={allUsers?.filter(u => u.isActive && u.lastLoginAt &&
              Math.floor((Date.now() - new Date(u.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24)) <= 7
            ).length ?? 0}
            subtitle="Active this week"
            icon={TrendingUp}
            color="success"
          />
        </div>

        {/* Users Grid */}
        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
          {filteredUsers.length > 0 ? (
            <>
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-5 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="col-span-4">User</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-2">Reviews</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {filteredUsers.map((userData) => {
                  const RoleIcon = getRoleIcon(userData.role);
                  return (
                    <div key={userData.id} className="px-6 py-5 hover:bg-gradient-to-r hover:from-gray-50 hover:to-primary-subtle/10 transition-all duration-200">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* User Info */}
                        <div className="col-span-4">
                          <div className="flex items-center gap-4">
                            {userData.photoURL ? (
                              <Image
                                src={userData.photoURL}
                                alt="Profile"
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light text-white rounded-full flex items-center justify-center text-lg font-semibold shadow-sm">
                                {(userData.displayName ?? userData.email).charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-gray-900 truncate">
                                {userData.displayName ?? userData.email.split('@')[0]}
                                {userData.id === dbUser.id && (
                                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">You</span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {userData.email}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Role */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor(userData.role)} rounded-xl flex items-center justify-center shadow-sm`}>
                              <RoleIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-gray-900 block">
                                {userData.role}
                              </span>
                              <span className="text-xs text-gray-500">
                                {userData.role === "ADMIN" ? "Full Access" :
                                 userData.role === "MODERATOR" ? "Content Control" : "Review Only"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Reviews */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                              <Award className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-gray-900 block">
                                {userData._count.reviews}
                              </span>
                              <span className="text-xs text-gray-500">
                                {userData._count.reviews === 1 ? "review" : "reviews"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              userData.isActive ? 'bg-emerald-100' : 'bg-gray-100'
                            }`}>
                              {userData.isActive ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-500" />
                              )}
                            </div>
                            <div>
                              <span className={`text-sm font-semibold block ${
                                userData.isActive ? 'text-emerald-700' : 'text-gray-500'
                              }`}>
                                {userData.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {userData.lastLoginAt
                                  ? new Date(userData.lastLoginAt).toLocaleDateString()
                                  : "Never"
                                }
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            {userData.id !== dbUser.id ? (
                              <select
                                value={userData.role}
                                onChange={(e) => handleRoleUpdate(userData.id, e.target.value as UserRole)}
                                disabled={updateRoleMutation.isPending}
                                className="text-sm px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 bg-white transition-all duration-200 font-medium"
                              >
                                <option value="ADMIN">Admin</option>
                                <option value="MODERATOR">Moderator</option>
                                <option value="REVIEWER">Reviewer</option>
                              </select>
                            ) : (
                              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl">
                                <Settings className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-700 font-semibold">Current User</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">No users found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm || selectedRole ? "Try adjusting your search criteria or filters to find users." : "No users are currently available in the system."}
              </p>
            </div>
          )}
        </div>

        {/* Platform Analytics */}
        {filteredUsers.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Platform Analytics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-primary-subtle to-primary-subtle/50 rounded-2xl border border-primary/10">
                <div className="text-3xl font-bold text-primary mb-2">
                  {filteredUsers.reduce((sum, user) => sum + (user.progress?.totalReviews ?? 0), 0)}
                </div>
                <p className="text-sm font-semibold text-gray-700">Total Reviews</p>
                <p className="text-xs text-gray-500 mt-1">All users combined</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {filteredUsers.reduce((sum, user) => sum + (user.progress?.approvedReviews ?? 0), 0)}
                </div>
                <p className="text-sm font-semibold text-gray-700">Approved Reviews</p>
                <p className="text-xs text-gray-500 mt-1">Quality contributions</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl border border-amber-200">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {filteredUsers.filter(user => user.progress?.lastReviewDate &&
                    new Date(user.progress.lastReviewDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </div>
                <p className="text-sm font-semibold text-gray-700">Active This Week</p>
                <p className="text-xs text-gray-500 mt-1">Recently contributing</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {Math.round(
                    (filteredUsers.reduce((sum, user) => sum + (user.progress?.approvedReviews ?? 0), 0) /
                    Math.max(filteredUsers.reduce((sum, user) => sum + (user.progress?.totalReviews ?? 0), 0), 1)) * 100
                  )}%
                </div>
                <p className="text-sm font-semibold text-gray-700">Approval Rate</p>
                <p className="text-xs text-gray-500 mt-1">Quality percentage</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}