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

  getAyahs: publicProcedure
    .input(z.object({
      surahNumber: z.number().min(1).max(114),
      limit: z.number().optional().default(20),
      offset: z.number().optional().default(0)
    }))
    .query(async ({ ctx, input }) => {
      // Get total count first
      const totalCount = await ctx.db.ayah.count({
        where: { SurahNumber: input.surahNumber },
      });

      const ayahs = await ctx.db.ayah.findMany({
        where: { SurahNumber: input.surahNumber },
        orderBy: { AyahNumber: "asc" },
        take: input.limit,
        skip: input.offset,
      });

      const translations = await ctx.db.translations.findMany({
        where: {
          SurahNumber: input.surahNumber,
          AyahNumber: {
            gte: ayahs[0]?.AyahNumber ?? 1,
            lte: ayahs[ayahs.length - 1]?.AyahNumber ?? 1,
          }
        },
        orderBy: { AyahNumber: "asc" },
        select: {
          AyahNumber: true,
          // English translations
          SaheehInternational: true,
          YousufAli: true,
          Pickthall: true,
          MaududiEn: true,
          // Urdu translations
          Maududi: true,
          Jalandhary: true,
          Junagarhi: true,
          Taqi: true,
          AhmadRaza: true,
          TahirulQadri: true,
        },
      });

      const ayahsWithTranslations = ayahs.map((ayah) => {
        const translation = translations.find(
          (t) => t.AyahNumber === ayah.AyahNumber
        );
        return {
          ...ayah,
          // English translation (primary)
          Translation: translation?.SaheehInternational ?? translation?.YousufAli ?? translation?.Pickthall,
          // Urdu translation
          UrduTranslation: translation?.Maududi ?? translation?.Jalandhary ?? translation?.Junagarhi ?? translation?.Taqi,
          // All available translations for future use
          AllTranslations: {
            english: {
              saheeh: translation?.SaheehInternational,
              yousufAli: translation?.YousufAli,
              pickthall: translation?.Pickthall,
              maududi: translation?.MaududiEn,
            },
            urdu: {
              maududi: translation?.Maududi,
              jalandhary: translation?.Jalandhary,
              junagarhi: translation?.Junagarhi,
              taqi: translation?.Taqi,
              ahmadRaza: translation?.AhmadRaza,
              tahirulQadri: translation?.TahirulQadri,
            }
          }
        };
      });

      return {
        ayahs: ayahsWithTranslations,
        totalCount,
        hasMore: input.offset + input.limit < totalCount,
      };
    }),
});
