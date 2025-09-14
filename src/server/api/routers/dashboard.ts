import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import type { UserRole, ReviewStatus, FlaggedStatus } from "@prisma/client";

export const dashboardRouter = createTRPCRouter({
  // Get dashboard overview stats based on user role
  getOverview: publicProcedure
    .input(z.object({ firebaseUid: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { firebaseUid: input.firebaseUid },
        include: { progress: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (user.role === "ADMIN") {
        // Admin overview - platform-wide stats
        const [
          totalUsers,
          activeReviewers,
          totalReviews,
          flaggedTranslations,
          todayMetrics,
        ] = await Promise.all([
          ctx.db.user.count({ where: { isActive: true } }),
          ctx.db.user.count({
            where: {
              isActive: true,
              role: "REVIEWER",
              progress: {
                lastReviewDate: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
                },
              },
            },
          }),
          ctx.db.translationReview.count(),
          ctx.db.flaggedTranslation.count({
            where: { status: "PENDING" },
          }),
          ctx.db.reviewMetrics.findFirst({
            where: {
              date: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
              },
            },
          }),
        ]);

        return {
          type: "admin" as const,
          totalUsers,
          activeReviewers,
          totalReviews,
          pendingFlags: flaggedTranslations,
          todayReviews: todayMetrics?.totalReviews ?? 0,
          todayApproved: todayMetrics?.approvedCount ?? 0,
          completionPercentage: todayMetrics?.completionPercentage ?? 0,
        };
      } else if (user.role === "MODERATOR") {
        // Moderator overview - moderation stats
        const [pendingFlags, totalFlags, processedToday] = await Promise.all([
          ctx.db.flaggedTranslation.count({
            where: { status: "PENDING" },
          }),
          ctx.db.flaggedTranslation.count(),
          ctx.db.flaggedTranslation.count({
            where: {
              processedAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
              },
            },
          }),
        ]);

        return {
          type: "moderator" as const,
          pendingFlags,
          totalFlags,
          processedToday,
          userProgress: user.progress,
        };
      } else {
        // Reviewer overview - personal stats
        const userReviews = await ctx.db.translationReview.findMany({
          where: { userId: user.id },
          include: {
            user: true,
          },
          orderBy: { reviewedAt: "desc" },
          take: 10,
        });

        return {
          type: "reviewer" as const,
          userProgress: user.progress,
          recentReviews: userReviews,
        };
      }
    }),

  // Get assigned content for reviewers
  getAssignedContent: publicProcedure
    .input(z.object({ firebaseUid: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { firebaseUid: input.firebaseUid },
        include: { progress: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // For now, assign first 5 surahs to all reviewers
      // In future, implement proper assignment system
      const surahs = await ctx.db.surah.findMany({
        take: 5,
        orderBy: { SurahNumber: "asc" },
      });

      // Get user's reviewed ayahs
      const reviewedAyahs = await ctx.db.translationReview.findMany({
        where: { userId: user.id },
        select: {
          surahNumber: true,
          ayahNumber: true,
          translationSource: true,
        },
      });

      return {
        assignedSurahs: surahs,
        reviewedAyahs,
        progress: user.progress,
      };
    }),

  // Submit a translation review
  submitReview: publicProcedure
    .input(
      z.object({
        firebaseUid: z.string(),
        surahNumber: z.number(),
        ayahNumber: z.number(),
        translationSource: z.string(),
        translationText: z.string(),
        status: z.enum(["APPROVED", "FLAGGED", "NEEDS_REVIEW"]),
        confidence: z.number().min(1).max(10),
        feedback: z.string().optional(),
        suggestedEdit: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { firebaseUid: input.firebaseUid },
        include: { progress: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Create the review
      const review = await ctx.db.translationReview.create({
        data: {
          userId: user.id,
          surahNumber: input.surahNumber,
          ayahNumber: input.ayahNumber,
          translationSource: input.translationSource,
          translationText: input.translationText,
          status: input.status as ReviewStatus,
          confidence: input.confidence,
          feedback: input.feedback,
          suggestedEdit: input.suggestedEdit,
        },
      });

      // Update user progress
      const today = new Date();
      const isNewDay =
        !user.progress?.lastReviewDate ||
        user.progress.lastReviewDate.toDateString() !== today.toDateString();

      await ctx.db.userProgress.update({
        where: { userId: user.id },
        data: {
          totalReviews: { increment: 1 },
          approvedReviews:
            input.status === "APPROVED"
              ? { increment: 1 }
              : undefined,
          flaggedReviews:
            input.status === "FLAGGED"
              ? { increment: 1 }
              : undefined,
          currentStreak: isNewDay
            ? user.progress?.currentStreak ?? 0 + 1
            : user.progress?.currentStreak ?? 1,
          longestStreak: Math.max(
            user.progress?.longestStreak ?? 0,
            isNewDay
              ? (user.progress?.currentStreak ?? 0) + 1
              : user.progress?.currentStreak ?? 1
          ),
          lastReviewDate: today,
        },
      });

      // If flagged, create or update flagged translation record
      if (input.status === "FLAGGED") {
        await ctx.db.flaggedTranslation.upsert({
          where: {
            surahNumber_ayahNumber_translationSource: {
              surahNumber: input.surahNumber,
              ayahNumber: input.ayahNumber,
              translationSource: input.translationSource,
            },
          },
          update: {
            flagCount: { increment: 1 },
            totalReviews: { increment: 1 },
            commonIssues: {
              push: input.feedback ? [input.feedback] : [],
            },
            suggestedEdits: {
              push: input.suggestedEdit ? [input.suggestedEdit] : [],
            },
          },
          create: {
            surahNumber: input.surahNumber,
            ayahNumber: input.ayahNumber,
            translationSource: input.translationSource,
            originalText: input.translationText,
            flagCount: 1,
            totalReviews: 1,
            commonIssues: input.feedback ? [input.feedback] : [],
            suggestedEdits: input.suggestedEdit ? [input.suggestedEdit] : [],
          },
        });
      }

      return review;
    }),

  // Get content for review (specific ayah with translations)
  getContentForReview: publicProcedure
    .input(
      z.object({
        surahNumber: z.number(),
        ayahNumber: z.number(),
        firebaseUid: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { firebaseUid: input.firebaseUid },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Get the ayah
      const ayah = await ctx.db.ayah.findFirst({
        where: {
          SurahNumber: input.surahNumber,
          AyahNumber: input.ayahNumber,
        },
      });

      // Get translations
      const translations = await ctx.db.translations.findFirst({
        where: {
          SurahNumber: input.surahNumber,
          AyahNumber: input.ayahNumber,
        },
      });

      // Get user's existing reviews for this ayah
      const existingReviews = await ctx.db.translationReview.findMany({
        where: {
          userId: user.id,
          surahNumber: input.surahNumber,
          ayahNumber: input.ayahNumber,
        },
      });

      return {
        ayah,
        translations,
        existingReviews,
      };
    }),

  // Admin: Get all users for management
  getAllUsers: publicProcedure
    .input(z.object({ firebaseUid: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { firebaseUid: input.firebaseUid },
      });

      if (!user || user.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const users = await ctx.db.user.findMany({
        include: {
          progress: true,
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return users;
    }),

  // Admin: Update user role
  updateUserRole: publicProcedure
    .input(
      z.object({
        adminFirebaseUid: z.string(),
        targetUserId: z.string(),
        newRole: z.enum(["ADMIN", "MODERATOR", "REVIEWER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const admin = await ctx.db.user.findUnique({
        where: { firebaseUid: input.adminFirebaseUid },
      });

      if (!admin || admin.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const updatedUser = await ctx.db.user.update({
        where: { id: input.targetUserId },
        data: { role: input.newRole as UserRole },
        include: { progress: true },
      });

      return updatedUser;
    }),

  // Get flagged translations for moderation
  getFlaggedTranslations: publicProcedure
    .input(z.object({ firebaseUid: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { firebaseUid: input.firebaseUid },
      });

      if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin or Moderator access required",
        });
      }

      const flaggedTranslations = await ctx.db.flaggedTranslation.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
      });

      return flaggedTranslations;
    }),

  // Process flagged translation (admin/moderator action)
  processFlaggedTranslation: publicProcedure
    .input(
      z.object({
        firebaseUid: z.string(),
        flaggedTranslationId: z.string(),
        decision: z.enum(["CONFIRMED", "REJECTED", "CORRECTED"]),
        adminNotes: z.string().optional(),
        correctedText: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { firebaseUid: input.firebaseUid },
      });

      if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin or Moderator access required",
        });
      }

      const updated = await ctx.db.flaggedTranslation.update({
        where: { id: input.flaggedTranslationId },
        data: {
          status: input.decision as FlaggedStatus,
          adminNotes: input.adminNotes,
          correctedText: input.correctedText,
          processedAt: new Date(),
          processedBy: user.id,
        },
      });

      return updated;
    }),
});