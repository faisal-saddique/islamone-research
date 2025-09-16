-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'MODERATOR', 'REVIEWER');

-- CreateEnum
CREATE TYPE "public"."ReviewStatus" AS ENUM ('APPROVED', 'FLAGGED', 'NEEDS_REVIEW');

-- CreateEnum
CREATE TYPE "public"."FlaggedStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'CORRECTED');

-- CreateTable
CREATE TABLE "public"."aasanquran" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER,
    "AyahNumber" INTEGER,
    "Translation" TEXT,
    "Tafseer" TEXT,
    "TranslationSimple" TEXT,

    CONSTRAINT "aasanquran_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."aasanquranintro" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER NOT NULL,
    "Heading" VARCHAR(200) NOT NULL,
    "Text" TEXT NOT NULL,

    CONSTRAINT "aasanquranintro_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."abudawood" (
    "Id" INTEGER NOT NULL,
    "HadithNumber" INTEGER NOT NULL,
    "ChapterId" INTEGER NOT NULL,
    "Chapter" TEXT,
    "Sanad" TEXT,
    "Arabic" TEXT,
    "Urdu" TEXT,
    "English" TEXT,

    CONSTRAINT "abudawood_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."abudawoodchapters" (
    "Id" INTEGER NOT NULL,
    "Topic" VARCHAR(255) NOT NULL,
    "HadithCount" INTEGER,

    CONSTRAINT "abudawoodchapters_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."ahsanulbayan" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER,
    "AyahNumber" INTEGER,
    "Translation" TEXT,
    "Tafseer" TEXT,
    "TranslationSimple" TEXT,

    CONSTRAINT "ahsanulbayan_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."ayah" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER,
    "AyahNumber" INTEGER,
    "AyahTextQalam" TEXT,
    "AyahTextMuhammadi" TEXT,
    "AyahTextPdms" TEXT,
    "AyahTextPlain" TEXT,
    "AyahTextIndoPakForIOS" TEXT,
    "SurahName" TEXT,
    "Ruku" INTEGER,
    "Sajda" INTEGER,
    "ParahNumber" INTEGER,
    "RukuParahNumber" INTEGER,
    "RukuSurahNumber" TEXT,
    "WordsNazar" TEXT,
    "WordsHashmi" TEXT,

    CONSTRAINT "ayah_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."bayanulquran" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER,
    "AyahNumber" INTEGER,
    "Translation" TEXT,
    "Tafseer" TEXT,

    CONSTRAINT "bayanulquran_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."bayanulquranintro" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER NOT NULL,
    "Heading" VARCHAR(200) NOT NULL,
    "Text" TEXT NOT NULL,

    CONSTRAINT "bayanulquranintro_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."bukhari" (
    "Id" INTEGER NOT NULL,
    "HadithNumber" INTEGER,
    "ChapterId" INTEGER NOT NULL,
    "Chapter" TEXT,
    "Sanad" TEXT,
    "Arabic" TEXT,
    "Urdu" TEXT,
    "English" TEXT,

    CONSTRAINT "bukhari_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."bukharichapters" (
    "Id" INTEGER NOT NULL,
    "Topic" VARCHAR(255) NOT NULL,
    "HadithCount" INTEGER,

    CONSTRAINT "bukharichapters_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."dua" (
    "id" INTEGER NOT NULL,
    "book" TEXT,
    "title" TEXT,
    "intro" TEXT,
    "arabic_text" TEXT,
    "translation" TEXT,
    "virtues" TEXT,

    CONSTRAINT "dua_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."duaindex" (
    "id" INTEGER NOT NULL,
    "book" TEXT,
    "sortorder" INTEGER,

    CONSTRAINT "duaindex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fiqh" (
    "id" INTEGER NOT NULL,
    "Chapter" TEXT,
    "Content" TEXT,

    CONSTRAINT "fiqh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ibneabbas" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER,
    "AyahNumber" INTEGER,
    "Translation" TEXT,
    "Tafseer" TEXT,

    CONSTRAINT "ibneabbas_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."ibnekaseer" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER,
    "AyahNumber" INTEGER,
    "Translation" TEXT,
    "Tafseer" TEXT,

    CONSTRAINT "ibnekaseer_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."ibnemaaja" (
    "Id" INTEGER NOT NULL,
    "HadithNumber" INTEGER NOT NULL,
    "ChapterId" INTEGER NOT NULL,
    "Chapter" TEXT,
    "Sanad" TEXT,
    "Arabic" TEXT,
    "Urdu" TEXT,
    "English" TEXT,

    CONSTRAINT "ibnemaaja_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."ibnemaajachapters" (
    "Id" INTEGER NOT NULL,
    "Topic" VARCHAR(255) NOT NULL,
    "HadithCount" INTEGER,

    CONSTRAINT "ibnemaajachapters_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."maarifulhadith" (
    "Id" INTEGER NOT NULL,
    "HadithNumber" INTEGER,
    "ChapterId" TEXT,
    "Chapter" TEXT NOT NULL,
    "Sanad" TEXT,
    "Arabic" TEXT,
    "Urdu" TEXT,

    CONSTRAINT "maarifulhadith_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."maarifulhadithchapters" (
    "Id" INTEGER NOT NULL,
    "Topic" VARCHAR(255) NOT NULL,
    "HadithCount" INTEGER,

    CONSTRAINT "maarifulhadithchapters_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."maarifulquran" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER,
    "AyahNumber" INTEGER,
    "Translation" TEXT,
    "Tafseer" TEXT,

    CONSTRAINT "maarifulquran_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."maarifulquranenglish" (
    "id" INTEGER NOT NULL,
    "SurahNumber" INTEGER,
    "AyahNumber" INTEGER,
    "Translation" TEXT,
    "Tafseer" TEXT,

    CONSTRAINT "maarifulquranenglish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mishkaat" (
    "Id" INTEGER NOT NULL,
    "HadithNumber" INTEGER NOT NULL,
    "ChapterId" TEXT NOT NULL,
    "Chapter" TEXT NOT NULL,
    "Sanad" TEXT NOT NULL,
    "Arabic" TEXT NOT NULL,
    "Urdu" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."mishkaatchapters" (
    "Id" INTEGER NOT NULL,
    "Topic" VARCHAR(255) NOT NULL,
    "HadithCount" INTEGER,

    CONSTRAINT "mishkaatchapters_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."motahimammalik" (
    "Id" INTEGER NOT NULL,
    "HadithNumber" INTEGER NOT NULL,
    "ChapterId" INTEGER NOT NULL,
    "Chapter" TEXT,
    "Sanad" TEXT,
    "Arabic" TEXT,
    "Urdu" TEXT,
    "English" TEXT,

    CONSTRAINT "motahimammalik_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."motahimammalikchapters" (
    "Id" INTEGER NOT NULL,
    "Topic" VARCHAR(255) NOT NULL,
    "HadithCount" INTEGER,

    CONSTRAINT "motahimammalikchapters_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."muslim" (
    "Id" INTEGER NOT NULL,
    "HadithNumber" INTEGER NOT NULL,
    "ChapterId" INTEGER NOT NULL,
    "Chapter" TEXT,
    "Sanad" TEXT,
    "Arabic" TEXT,
    "Urdu" TEXT,
    "English" TEXT,

    CONSTRAINT "muslim_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."muslimchapters" (
    "Id" INTEGER NOT NULL,
    "Topic" VARCHAR(255) NOT NULL,
    "HadithCount" INTEGER,

    CONSTRAINT "muslimchapters_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."musnadahmad" (
    "Id" INTEGER NOT NULL,
    "HadithNumber" INTEGER NOT NULL,
    "ChapterId" INTEGER NOT NULL,
    "Chapter" TEXT,
    "Sanad" TEXT,
    "Arabic" TEXT,
    "Urdu" TEXT,

    CONSTRAINT "musnadahmad_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."musnadahmadchapters" (
    "Id" INTEGER NOT NULL,
    "Topic" VARCHAR(255) NOT NULL,
    "HadithCount" INTEGER,
    "FirstHadithId" INTEGER,

    CONSTRAINT "musnadahmadchapters_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."nasai" (
    "Id" INTEGER NOT NULL,
    "HadithNumber" INTEGER NOT NULL,
    "ChapterId" INTEGER NOT NULL,
    "Chapter" TEXT,
    "Sanad" TEXT,
    "Arabic" TEXT,
    "Urdu" TEXT,
    "English" TEXT,

    CONSTRAINT "nasai_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."nasaichapters" (
    "Id" INTEGER NOT NULL,
    "Topic" VARCHAR(255) NOT NULL,
    "HadithCount" INTEGER,

    CONSTRAINT "nasaichapters_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."parah" (
    "ParahNumber" SMALLINT NOT NULL,
    "Parah" VARCHAR(255) NOT NULL,
    "NameEnglish" TEXT,
    "AyahCount" INTEGER,

    CONSTRAINT "parah_pkey" PRIMARY KEY ("ParahNumber")
);

-- CreateTable
CREATE TABLE "public"."seerahbooks" (
    "Id" INTEGER NOT NULL,
    "Name" VARCHAR(255) NOT NULL,

    CONSTRAINT "seerahbooks_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."seerahcontent" (
    "Id" INTEGER NOT NULL,
    "Book" TEXT,
    "Chapter" TEXT,
    "Text" TEXT,

    CONSTRAINT "seerahcontent_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."shamail" (
    "Id" INTEGER NOT NULL,
    "HadithNumber" INTEGER NOT NULL,
    "ChapterId" INTEGER NOT NULL,
    "Chapter" TEXT,
    "Sanad" TEXT,
    "Arabic" TEXT,
    "Urdu" TEXT,
    "English" TEXT,

    CONSTRAINT "shamail_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."shamailchapters" (
    "Id" INTEGER NOT NULL,
    "Topic" VARCHAR(255) NOT NULL,
    "HadithCount" INTEGER,
    "FirstHadithId" INTEGER,

    CONSTRAINT "shamailchapters_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."surah" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER NOT NULL,
    "AyahCount" INTEGER NOT NULL,
    "StartAyahNumber" INTEGER NOT NULL,
    "NameArabic" VARCHAR(200) NOT NULL,
    "NameEnglish" VARCHAR(100) NOT NULL,
    "NameMeaning" VARCHAR(100) NOT NULL,
    "Type" VARCHAR(45) NOT NULL,
    "RevelationOrder" INTEGER NOT NULL,
    "RukuCount" INTEGER NOT NULL,

    CONSTRAINT "surah_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."tadabburequran" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER,
    "AyahNumber" INTEGER,
    "Translation" TEXT,
    "Tafseer" TEXT,

    CONSTRAINT "tadabburequran_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."tadabburequranintro" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER NOT NULL,
    "Heading" VARCHAR(200) NOT NULL,
    "Text" TEXT NOT NULL,

    CONSTRAINT "tadabburequranintro_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."tafheemenglish" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER,
    "AyahNumber" INTEGER,
    "Translation" TEXT,
    "Tafseer" TEXT,
    "TranslationSimple" TEXT,

    CONSTRAINT "tafheemenglish_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."tafheemenglishintro" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER NOT NULL,
    "Heading" VARCHAR(200) NOT NULL,
    "Text" TEXT NOT NULL,

    CONSTRAINT "tafheemenglishintro_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."tafheemulquran" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER,
    "AyahNumber" INTEGER,
    "Translation" TEXT,
    "Tafseer" TEXT,
    "TranslationSimple" TEXT,

    CONSTRAINT "tafheemulquran_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."tafheemulquranintro" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER NOT NULL,
    "Heading" VARCHAR(200) NOT NULL,
    "Text" TEXT NOT NULL,

    CONSTRAINT "tafheemulquranintro_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."tafseeralquran" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER,
    "AyahNumber" INTEGER,
    "Translation" TEXT,
    "Tafseer" TEXT,

    CONSTRAINT "tafseeralquran_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."tirmidhi" (
    "Id" INTEGER NOT NULL,
    "HadithNumber" INTEGER NOT NULL,
    "ChapterId" INTEGER NOT NULL,
    "Chapter" TEXT,
    "Sanad" TEXT,
    "Arabic" TEXT,
    "Urdu" TEXT,
    "English" TEXT,

    CONSTRAINT "tirmidhi_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."tirmidhichapters" (
    "Id" INTEGER NOT NULL,
    "Topic" VARCHAR(255) NOT NULL,
    "HadithCount" INTEGER,

    CONSTRAINT "tirmidhichapters_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."translations" (
    "Id" INTEGER NOT NULL,
    "SurahNumber" INTEGER,
    "AyahNumber" INTEGER,
    "Maududi" TEXT,
    "Jalandhary" TEXT,
    "Junagarhi" TEXT,
    "Taqi" TEXT,
    "AhmadRaza" TEXT,
    "TahirulQadri" TEXT,
    "AbdusSalam" TEXT,
    "Kilani" TEXT,
    "Islahi" TEXT,
    "Majid" TEXT,
    "Israr" TEXT,
    "Riffat" TEXT,
    "Transliteration" TEXT,
    "MaududiEn" TEXT,
    "Mubarakpuri" TEXT,
    "Pickthall" TEXT,
    "SaheehInternational" TEXT,
    "Sarwar" TEXT,
    "Shakir" TEXT,
    "YousufAli" TEXT,
    "TaqiEnglish" TEXT,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "firebaseUid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "photoURL" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "public"."UserRole" NOT NULL DEFAULT 'REVIEWER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "approvedReviews" INTEGER NOT NULL DEFAULT 0,
    "flaggedReviews" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastReviewDate" TIMESTAMP(3),
    "completedSurahs" JSONB NOT NULL DEFAULT '[]',
    "reviewedAyahs" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."translation_reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "surahNumber" INTEGER NOT NULL,
    "ayahNumber" INTEGER NOT NULL,
    "translationSource" TEXT NOT NULL,
    "translationText" TEXT NOT NULL,
    "status" "public"."ReviewStatus" NOT NULL,
    "confidence" INTEGER NOT NULL DEFAULT 5,
    "feedback" TEXT,
    "suggestedEdit" TEXT,
    "adminNotes" TEXT,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "processingNotes" TEXT,
    "processedAt" TIMESTAMP(3),
    "processedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translation_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."review_metrics" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "approvedCount" INTEGER NOT NULL DEFAULT 0,
    "flaggedCount" INTEGER NOT NULL DEFAULT 0,
    "needsReviewCount" INTEGER NOT NULL DEFAULT 0,
    "activeReviewers" INTEGER NOT NULL DEFAULT 0,
    "newUsers" INTEGER NOT NULL DEFAULT 0,
    "translationMetrics" JSONB NOT NULL DEFAULT '{}',
    "completionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "averageConfidence" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."flagged_translations" (
    "id" TEXT NOT NULL,
    "surahNumber" INTEGER NOT NULL,
    "ayahNumber" INTEGER NOT NULL,
    "translationSource" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "flagCount" INTEGER NOT NULL DEFAULT 1,
    "totalReviews" INTEGER NOT NULL DEFAULT 1,
    "averageConfidence" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "commonIssues" JSONB NOT NULL DEFAULT '[]',
    "suggestedEdits" JSONB NOT NULL DEFAULT '[]',
    "status" "public"."FlaggedStatus" NOT NULL DEFAULT 'PENDING',
    "adminDecision" TEXT,
    "correctedText" TEXT,
    "adminNotes" TEXT,
    "processedAt" TIMESTAMP(3),
    "processedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flagged_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."words" (
    "SurahNumber" INTEGER,
    "AyahNumber" INTEGER,
    "Word" INTEGER,
    "Arabic" TEXT,
    "English" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "users_firebaseUid_key" ON "public"."users"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_userId_key" ON "public"."user_progress"("userId");

-- CreateIndex
CREATE INDEX "translation_reviews_surahNumber_ayahNumber_idx" ON "public"."translation_reviews"("surahNumber", "ayahNumber");

-- CreateIndex
CREATE INDEX "translation_reviews_status_idx" ON "public"."translation_reviews"("status");

-- CreateIndex
CREATE INDEX "translation_reviews_isProcessed_idx" ON "public"."translation_reviews"("isProcessed");

-- CreateIndex
CREATE UNIQUE INDEX "translation_reviews_userId_surahNumber_ayahNumber_translati_key" ON "public"."translation_reviews"("userId", "surahNumber", "ayahNumber", "translationSource");

-- CreateIndex
CREATE UNIQUE INDEX "review_metrics_date_key" ON "public"."review_metrics"("date");

-- CreateIndex
CREATE INDEX "flagged_translations_status_idx" ON "public"."flagged_translations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "flagged_translations_surahNumber_ayahNumber_translationSour_key" ON "public"."flagged_translations"("surahNumber", "ayahNumber", "translationSource");

-- AddForeignKey
ALTER TABLE "public"."user_progress" ADD CONSTRAINT "user_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."translation_reviews" ADD CONSTRAINT "translation_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
