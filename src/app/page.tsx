import { LatestSurah } from "~/app/_components/surah";
import { AuthStatus } from "~/components/auth/auth-status";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  void api.quran.getSurahs.prefetch({ limit: 3 });

  return (
    <HydrateClient>
      <div className="flex flex-col items-center justify-center py-8">
        <div className="container flex flex-col items-center justify-center gap-8 px-4">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-2xl text-neutral-800">
            Islam<span className="text-primary">One</span> Research
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl text-center">
            Comprehensive Islamic research platform with Quran, Hadith, and Islamic literature
          </p>

          <AuthStatus />

          <LatestSurah />
        </div>
      </div>
    </HydrateClient>
  );
}
