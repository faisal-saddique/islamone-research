"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuthContext } from "~/providers/auth-provider";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import type { UserRole } from "@prisma/client";

export default function UserManagementPage() {
  const { user, dbUser } = useAuthContext();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allUsers, refetch } = api.dashboard.getAllUsers.useQuery(
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
  }) ?? [];

  if (!user || !dbUser || dbUser.role !== "ADMIN") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 text-center">
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">
            Access Denied
          </h2>
          <p className="text-neutral-500">
            Admin access required to view user management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
          User Management
        </h1>
        <p className="text-neutral-500">
          Manage user roles and permissions
        </p>
      </div>

      {/* Filters */}
      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Search Users
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full p-3 border border-neutral-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Filter by Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole | "")}
              className="w-full p-3 border border-neutral-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MODERATOR">Moderator</option>
              <option value="REVIEWER">Reviewer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-300 text-center">
          <p className="text-2xl font-semibold text-neutral-800">
            {allUsers?.length ?? 0}
          </p>
          <p className="text-sm text-neutral-500">Total Users</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-300 text-center">
          <p className="text-2xl font-semibold text-error">
            {allUsers?.filter(u => u.role === "ADMIN").length ?? 0}
          </p>
          <p className="text-sm text-neutral-500">Admins</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-300 text-center">
          <p className="text-2xl font-semibold text-warning">
            {allUsers?.filter(u => u.role === "MODERATOR").length ?? 0}
          </p>
          <p className="text-sm text-neutral-500">Moderators</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-300 text-center">
          <p className="text-2xl font-semibold text-success">
            {allUsers?.filter(u => u.role === "REVIEWER").length ?? 0}
          </p>
          <p className="text-sm text-neutral-500">Reviewers</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-neutral-50 rounded-lg border border-neutral-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-100 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Reviews
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-neutral-50 divide-y divide-neutral-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-100">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.photoURL ? (
                        <Image 
                          src={user.photoURL} 
                          alt="Profile" 
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary text-neutral-50 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {(user.displayName ?? user.email).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-neutral-900">
                          {user.displayName ?? user.email.split('@')[0]}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs text-neutral-50 ${
                      user.role === "ADMIN"
                        ? "bg-error"
                        : user.role === "MODERATOR"
                        ? "bg-warning"
                        : "bg-success"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {user._count.reviews}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.isActive
                        ? "bg-success text-neutral-50"
                        : "bg-neutral-300 text-neutral-700"
                    }`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {user.lastLoginAt 
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : "Never"
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {/* Role Update Dropdown */}
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(user.id, e.target.value as UserRole)}
                        disabled={updateRoleMutation.isPending || user.id === dbUser.id}
                        className="text-xs p-1 border border-neutral-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent disabled:opacity-50"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="MODERATOR">Moderator</option>
                        <option value="REVIEWER">Reviewer</option>
                      </select>
                      
                      {user.id === dbUser.id && (
                        <span className="text-xs text-neutral-500">(You)</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-neutral-500">
              {searchTerm || selectedRole ? "No users match your filters." : "No users found."}
            </p>
          </div>
        )}
      </div>

      {/* User Progress Summary */}
      {filteredUsers.length > 0 && (
        <div className="mt-8 bg-neutral-50 rounded-lg p-6 border border-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Progress Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-primary">
                {filteredUsers.reduce((sum, user) => sum + (user.progress?.totalReviews ?? 0), 0)}
              </p>
              <p className="text-sm text-neutral-500">Total Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-success">
                {filteredUsers.reduce((sum, user) => sum + (user.progress?.approvedReviews ?? 0), 0)}
              </p>
              <p className="text-sm text-neutral-500">Approved Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-warning">
                {filteredUsers.filter(user => user.progress?.lastReviewDate && 
                  new Date(user.progress.lastReviewDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length}
              </p>
              <p className="text-sm text-neutral-500">Active This Week</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}