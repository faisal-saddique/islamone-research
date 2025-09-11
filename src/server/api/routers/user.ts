import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  // Create or update user from Firebase auth
  createOrUpdate: publicProcedure
    .input(
      z.object({
        firebaseUid: z.string(),
        email: z.string().email(),
        displayName: z.string().optional(),
        photoURL: z.string().url().optional(),
        emailVerified: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Try to find existing user first
        const existingUser = await ctx.db.user.findUnique({
          where: { firebaseUid: input.firebaseUid },
        });

        if (existingUser) {
          // Update existing user
          const updatedUser = await ctx.db.user.update({
            where: { firebaseUid: input.firebaseUid },
            data: {
              email: input.email,
              displayName: input.displayName,
              photoURL: input.photoURL,
              emailVerified: input.emailVerified,
              lastLoginAt: new Date(),
              updatedAt: new Date(),
            },
            include: {
              progress: true,
            },
          });
          
          return updatedUser;
        } else {
          // Create new user with progress tracking
          const newUser = await ctx.db.user.create({
            data: {
              firebaseUid: input.firebaseUid,
              email: input.email,
              displayName: input.displayName,
              photoURL: input.photoURL,
              emailVerified: input.emailVerified,
              lastLoginAt: new Date(),
              progress: {
                create: {
                  totalReviews: 0,
                  approvedReviews: 0,
                  flaggedReviews: 0,
                  currentStreak: 0,
                  longestStreak: 0,
                },
              },
            },
            include: {
              progress: true,
            },
          });

          return newUser;
        }
      } catch (error) {
        console.error("Error creating/updating user:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create or update user",
        });
      }
    }),

  // Get user by Firebase UID
  getByFirebaseUid: publicProcedure
    .input(z.object({ firebaseUid: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: { firebaseUid: input.firebaseUid },
          include: {
            progress: true,
            reviews: {
              take: 10,
              orderBy: { reviewedAt: "desc" },
            },
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        return user;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error("Error fetching user:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user",
        });
      }
    }),

  // Update user profile
  updateProfile: publicProcedure
    .input(
      z.object({
        firebaseUid: z.string(),
        displayName: z.string().optional(),
        photoURL: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedUser = await ctx.db.user.update({
          where: { firebaseUid: input.firebaseUid },
          data: {
            displayName: input.displayName,
            photoURL: input.photoURL,
            updatedAt: new Date(),
          },
          include: {
            progress: true,
          },
        });

        return updatedUser;
      } catch (error) {
        console.error("Error updating user profile:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update user profile",
        });
      }
    }),

  // Update last login timestamp
  updateLastLogin: publicProcedure
    .input(z.object({ firebaseUid: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.user.update({
          where: { firebaseUid: input.firebaseUid },
          data: {
            lastLoginAt: new Date(),
          },
        });

        return { success: true };
      } catch (error) {
        console.error("Error updating last login:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update last login",
        });
      }
    }),

  // Get user progress
  getProgress: publicProcedure
    .input(z.object({ firebaseUid: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: { firebaseUid: input.firebaseUid },
          include: {
            progress: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        return user.progress;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error("Error fetching user progress:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user progress",
        });
      }
    }),

  // Delete user account
  deleteAccount: publicProcedure
    .input(z.object({ firebaseUid: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Soft delete by setting isActive to false
        await ctx.db.user.update({
          where: { firebaseUid: input.firebaseUid },
          data: {
            isActive: false,
            updatedAt: new Date(),
          },
        });

        return { success: true };
      } catch (error) {
        console.error("Error deleting user account:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete user account",
        });
      }
    }),
});
