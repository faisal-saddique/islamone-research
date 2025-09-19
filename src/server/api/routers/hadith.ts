import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const HadithCollectionSchema = z.enum([
  "bukhari",
  "muslim",
  "abudawood",
  "tirmidhi",
  "nasai",
  "ibnemaaja"
]);

export const hadithRouter = createTRPCRouter({
  getCollections: publicProcedure.query(async () => {
    const collections = [
      {
        id: "bukhari",
        name: "Sahih Bukhari",
        nameArabic: "صحيح البخاري",
        description: "The most authentic collection of hadith",
        compiler: "Imam Al-Bukhari",
      },
      {
        id: "muslim",
        name: "Sahih Muslim",
        nameArabic: "صحيح مسلم",
        description: "Second most authentic collection",
        compiler: "Imam Muslim",
      },
      {
        id: "abudawood",
        name: "Sunan Abu Dawud",
        nameArabic: "سنن أبو داود",
        description: "Collection focusing on legal issues",
        compiler: "Imam Abu Dawud",
      },
      {
        id: "tirmidhi",
        name: "Jami at-Tirmidhi",
        nameArabic: "جامع الترمذي",
        description: "Known for grading authenticity",
        compiler: "Imam At-Tirmidhi",
      },
      {
        id: "nasai",
        name: "Sunan an-Nasai",
        nameArabic: "سنن النسائي",
        description: "Comprehensive collection",
        compiler: "Imam An-Nasai",
      },
      {
        id: "ibnemaaja",
        name: "Sunan Ibn Majah",
        nameArabic: "سنن ابن ماجه",
        description: "Last of the six major collections",
        compiler: "Imam Ibn Majah",
      },
    ];

    return collections;
  }),

  getChapters: publicProcedure
    .input(z.object({
      collection: HadithCollectionSchema,
      limit: z.number().optional().default(50)
    }))
    .query(async ({ ctx, input }) => {
      let chapters: Array<{ Id: number; Topic: string | null; HadithCount?: number | null }>;

      switch (input.collection) {
        case "bukhari":
          chapters = await ctx.db.bukharichapters.findMany({
            take: input.limit,
            orderBy: { Id: "asc" },
          });
          break;
        case "muslim":
          chapters = await ctx.db.muslimchapters.findMany({
            take: input.limit,
            orderBy: { Id: "asc" },
          });
          break;
        case "abudawood":
          chapters = await ctx.db.abudawoodchapters.findMany({
            take: input.limit,
            orderBy: { Id: "asc" },
          });
          break;
        case "tirmidhi":
          chapters = await ctx.db.tirmidhichapters.findMany({
            take: input.limit,
            orderBy: { Id: "asc" },
          });
          break;
        case "nasai":
          chapters = await ctx.db.nasaichapters.findMany({
            take: input.limit,
            orderBy: { Id: "asc" },
          });
          break;
        case "ibnemaaja":
          chapters = await ctx.db.ibnemaajachapters.findMany({
            take: input.limit,
            orderBy: { Id: "asc" },
          });
          break;
        default:
          chapters = [];
      }

      return chapters;
    }),

  getHadithsByChapter: publicProcedure
    .input(z.object({
      collection: HadithCollectionSchema,
      chapterId: z.number(),
      limit: z.number().optional().default(20),
      offset: z.number().optional().default(0)
    }))
    .query(async ({ ctx, input }) => {
      let hadiths: Array<{ Id: number; HadithNumber: number | null; Arabic?: string | null; English?: string | null; Urdu?: string | null; Sanad?: string | null; ChapterId: number; Chapter?: string | null }>;

      switch (input.collection) {
        case "bukhari":
          hadiths = await ctx.db.bukhari.findMany({
            where: { ChapterId: input.chapterId },
            take: input.limit,
            skip: input.offset,
            orderBy: { HadithNumber: "asc" },
          });
          break;
        case "muslim":
          hadiths = await ctx.db.muslim.findMany({
            where: { ChapterId: input.chapterId },
            take: input.limit,
            skip: input.offset,
            orderBy: { HadithNumber: "asc" },
          });
          break;
        case "abudawood":
          hadiths = await ctx.db.abudawood.findMany({
            where: { ChapterId: input.chapterId },
            take: input.limit,
            skip: input.offset,
            orderBy: { HadithNumber: "asc" },
          });
          break;
        case "tirmidhi":
          hadiths = await ctx.db.tirmidhi.findMany({
            where: { ChapterId: input.chapterId },
            take: input.limit,
            skip: input.offset,
            orderBy: { HadithNumber: "asc" },
          });
          break;
        case "nasai":
          hadiths = await ctx.db.nasai.findMany({
            where: { ChapterId: input.chapterId },
            take: input.limit,
            skip: input.offset,
            orderBy: { HadithNumber: "asc" },
          });
          break;
        case "ibnemaaja":
          hadiths = await ctx.db.ibnemaaja.findMany({
            where: { ChapterId: input.chapterId },
            take: input.limit,
            skip: input.offset,
            orderBy: { HadithNumber: "asc" },
          });
          break;
        default:
          hadiths = [];
      }

      return hadiths;
    }),

  getHadithByNumber: publicProcedure
    .input(z.object({
      collection: HadithCollectionSchema,
      hadithNumber: z.number()
    }))
    .query(async ({ ctx, input }) => {
      let hadith: { Id: number; HadithNumber: number | null; Arabic?: string | null; English?: string | null; Urdu?: string | null; Sanad?: string | null; ChapterId: number; Chapter?: string | null } | null;

      switch (input.collection) {
        case "bukhari":
          hadith = await ctx.db.bukhari.findFirst({
            where: { HadithNumber: input.hadithNumber },
          });
          break;
        case "muslim":
          hadith = await ctx.db.muslim.findFirst({
            where: { HadithNumber: input.hadithNumber },
          });
          break;
        case "abudawood":
          hadith = await ctx.db.abudawood.findFirst({
            where: { HadithNumber: input.hadithNumber },
          });
          break;
        case "tirmidhi":
          hadith = await ctx.db.tirmidhi.findFirst({
            where: { HadithNumber: input.hadithNumber },
          });
          break;
        case "nasai":
          hadith = await ctx.db.nasai.findFirst({
            where: { HadithNumber: input.hadithNumber },
          });
          break;
        case "ibnemaaja":
          hadith = await ctx.db.ibnemaaja.findFirst({
            where: { HadithNumber: input.hadithNumber },
          });
          break;
        default:
          hadith = null;
      }

      return hadith ?? null;
    }),
});