import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const quranRouter = createTRPCRouter({
  getSurahs: publicProcedure
    .input(z.object({ limit: z.number().optional().default(5) }))
    .query(async ({ ctx, input }) => {
      const surahs = await ctx.db.surah.findMany({
        take: input.limit,
        orderBy: { SurahNumber: "asc" },
        select: {
          Id: true,
          SurahNumber: true,
          AyahCount: true,
          NameArabic: true,
          NameEnglish: true,
          NameMeaning: true,
          Type: true,
        },
      });

      return surahs;
    }),

  getSurahByNumber: publicProcedure
    .input(z.object({ surahNumber: z.number().min(1).max(114) }))
    .query(async ({ ctx, input }) => {
      const surah = await ctx.db.surah.findFirst({
        where: { SurahNumber: input.surahNumber },
      });

      return surah ?? null;
    }),

  getRandomAyah: publicProcedure.query(async ({ ctx }) => {
    const ayah = await ctx.db.ayah.findFirst({
      where: {
        AyahTextPlain: { not: null },
      },
      orderBy: { Id: "asc" },
      take: 1,
    });

    return ayah ?? null;
  }),
});
