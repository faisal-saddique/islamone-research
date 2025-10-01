import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const azkaarRouter = createTRPCRouter({
  getBooks: publicProcedure.query(async ({ ctx }) => {
    const books = await ctx.db.duaindex.findMany({
      orderBy: { sortorder: "asc" },
    });

    // Count duas for each book
    const booksWithCounts = await Promise.all(
      books.map(async (book) => {
        const count = await ctx.db.dua.count({
          where: { book: book.book },
        });

        return {
          id: book.id,
          book: book.book,
          sortorder: book.sortorder,
          duaCount: count,
        };
      })
    );

    return booksWithCounts;
  }),

  getDuasByBook: publicProcedure
    .input(
      z.object({
        book: z.string(),
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const duas = await ctx.db.dua.findMany({
        where: { book: input.book },
        take: input.limit,
        skip: input.offset,
        orderBy: { id: "asc" },
      });

      const totalCount = await ctx.db.dua.count({
        where: { book: input.book },
      });

      return {
        duas,
        totalCount,
        hasMore: input.offset + input.limit < totalCount,
      };
    }),

  getDuaById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const dua = await ctx.db.dua.findUnique({
        where: { id: input.id },
      });

      return dua;
    }),

  searchDuas: publicProcedure
    .input(
      z.object({
        query: z.string(),
        limit: z.number().optional().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const duas = await ctx.db.dua.findMany({
        where: {
          OR: [
            { title: { contains: input.query, mode: "insensitive" } },
            { translation: { contains: input.query, mode: "insensitive" } },
            { arabic_text: { contains: input.query, mode: "insensitive" } },
          ],
        },
        take: input.limit,
        orderBy: { id: "asc" },
      });

      return duas;
    }),
});
