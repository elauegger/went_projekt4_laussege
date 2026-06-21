import Link from "next/link";
import type { ReactNode } from "react";
import { headers } from "next/headers";

import { MobileNav } from "../components/dashboard/MobileNav";
import { SiteFooter } from "../components/SiteFooter";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { getCVAnalysisModelLabel } from "../lib/cv-analysis";
import { getTopMatchingJobs } from "../lib/jobs";
import { signOutAction } from "./actions/auth";

function stringArrayFromJson(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is string => typeof item === "string");
}

function containsPlaceholderFeedback(items: string[]) {
  return items.some((item) =>
    /kurzer text|\bstring\b|beispiel|platzhalter/i.test(item)
  );
}

type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

const sidebarItems: NavItem[] = [
  { label: "Dashboard", href: "/", active: true },
  { label: "Jobs", href: "/jobs" },
  { label: "Lebensläufe", href: "/cv-upload" },
  { label: "Profil", href: "/profile" },
  { label: "KI-Analyse", href: "/ai-analysis" },
];

function NavGlyph({ active = false }: { active?: boolean }) {
  return (
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-semibold ${active
        ? "border-[#e6dfc8] bg-[#f4ebd2] text-[#5a6340]"
        : "border-white/10 bg-white/5 text-[#f5edd4]"
        }`}
    >
      •
    </span>
  );
}

function LeafMark() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
      <path
        d="M18 62C40 25 66 16 102 18C79 28 58 47 43 68C33 65 25 64 18 62Z"
        fill="rgba(246, 239, 219, 0.6)"
      />
      <path
        d="M35 54C52 35 69 26 92 24"
        stroke="rgba(93, 109, 62, 0.7)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M47 59C57 48 65 40 74 34"
        stroke="rgba(93, 109, 62, 0.45)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SectionCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border border-[#e5dcc1] bg-white/74 p-5 shadow-[0_14px_40px_rgba(116,101,65,0.07)] backdrop-blur-sm ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.32em] text-[#8a8467]">
          {title}
        </h2>
        <span className="h-px flex-1 bg-[#e8dec4]" />
      </div>
      {children}
    </section>
  );
}

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const authenticated = Boolean(session?.user);
  const displayName = session?.user?.name?.split(" ")[0] ?? "Gast";
  const headline = authenticated ? `Hallo ${displayName}!` : "Willkommen !";

  const userCvUploads = authenticated
    ? await prisma.cv_uploads.findMany({
      where: { userId: session!.user.id },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        originalFilename: true,
        extractedText: true,
        fileSizeBytes: true,
        createdAt: true,
        analysisScore: true,
        analysisStrengths: true,
        analysisWeaknesses: true,
        analysisImprovements: true,
        analysisModelUsed: true,
        analyzedAt: true,
      },
    })
    : [];

  const latestCv = userCvUploads[0] ?? null;
  const cvCount = userCvUploads.length;
  const currentAnalysisModelLabel = getCVAnalysisModelLabel();

  const latestAnalyzedCv =
    userCvUploads.find((cv) => {
      const strengths = stringArrayFromJson(cv.analysisStrengths);
      const weaknesses = stringArrayFromJson(cv.analysisWeaknesses);
      const improvements = stringArrayFromJson(cv.analysisImprovements);
      const hasStoredAnalysis = !!(
        cv.analysisScore !== null &&
        strengths.length > 0 &&
        weaknesses.length > 0 &&
        improvements.length > 0
      );
      const hasPlaceholderFeedback =
        containsPlaceholderFeedback(strengths) ||
        containsPlaceholderFeedback(weaknesses) ||
        containsPlaceholderFeedback(improvements);

      return (
        hasStoredAnalysis &&
        !hasPlaceholderFeedback &&
        cv.analysisModelUsed === currentAnalysisModelLabel
      );
    }) ?? null;

  const latestAnalysis = latestAnalyzedCv
    ? {
      originalFilename: latestAnalyzedCv.originalFilename,
      score: latestAnalyzedCv.analysisScore!,
      strengths: stringArrayFromJson(latestAnalyzedCv.analysisStrengths),
      weaknesses: stringArrayFromJson(latestAnalyzedCv.analysisWeaknesses),
      improvements: stringArrayFromJson(latestAnalyzedCv.analysisImprovements),
      analyzedAt: latestAnalyzedCv.analyzedAt,
    }
    : null;

  const cvText = latestCv?.extractedText?.trim() ?? "";

  const recentUploads = userCvUploads.slice(0, 3);

  const activities = recentUploads.map((u) => ({
    title: `Lebenslauf hochgeladen: ${u.originalFilename}`,
    time: u.createdAt.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  }));

  const topMatches = cvText ? await getTopMatchingJobs(cvText, 3) : [];

  return (
    <div>
    <main className="min-h-screen px-3 py-3 text-[#2f3628] sm:px-5 sm:py-5 lg:px-6">
      <div className="relative mx-auto min-h-[calc(100vh-1.5rem)] max-w-screen-2xl overflow-hidden rounded-[36px] border border-[#d9ceb1] bg-[#f6f0e6] ">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-5%] top-[-8%] h-72 w-72 rounded-full bg-[#8e9a63]/12 blur-3xl" />
          <div className="absolute right-[8%] top-[10%] h-96 w-96 rounded-full bg-[#e9d972]/18 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[18%] h-80 w-80 rounded-full bg-[#d8c9a5]/18 blur-3xl" />
        </div>

        <div className="relative grid min-h-[calc(100vh-1.5rem)] lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="hidden border-r border-[#dccfb0] bg-[#75824e] text-[#f8f1de] lg:flex lg:flex-col">
            <div className="flex items-center justify-between px-6 py-6">
              <p className="font-serif text-4xl leading-none text-[#f6efd8]">
                Jobsy
              </p>
              <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-[#f6efd8]/80">
                Pro
              </span>
            </div>

            <nav className="flex-1 px-4 pb-4">
              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${item.active
                      ? "bg-[#f3ebcf] text-[#55603a] shadow-sm"
                      : "text-[#efe7c8] hover:bg-white/8"
                      }`}
                  >
                    <NavGlyph active={item.active} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </nav>

           
          </aside>

          <div className="flex min-w-0 flex-col">
            <MobileNav items={sidebarItems} />

            <header className="border-b border-[#e2d7bc] bg-[#fbf8f0]/75 px-4 py-4 backdrop-blur md:px-6 lg:px-8">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.42em] text-[#8d8667]">
                    Karriere-Analyse Studio
                  </p>
                  <h1 className="mt-3 font-serif text-4xl leading-tight text-[#4d5240] sm:text-5xl">
                    {headline}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f6a58] sm:text-base">
                    {authenticated
                      ? "Dein Dashboard ist bereit. Lade deinen Lebenslauf hoch und analysiere passende Karrierechancen."
                      : "Wir sind für dich da, um deine Karriere zu unterstützen. Melde dich an, um deinen Lebenslauf zu analysieren und passende Jobs zu entdecken."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                  {authenticated ? (
                    <>
                      <Link
                        href="/cv-upload"
                        className="inline-flex items-center justify-center rounded-full bg-[#74824a] px-5 py-2.5 text-sm font-semibold text-[#f8f3e3] shadow-sm transition hover:bg-[#65743f]"
                      >
                        Lebenslauf hochladen
                      </Link>

                      <Link href="/profile">
                        <div className="flex h-11 items-center gap-3 rounded-full border border-[#d7ccb0] bg-white/80 px-3 pr-4">
                          <div className="h-8 w-8 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f3e8c4,#b7c08b)]" />
                          <div className="hidden sm:block">
                            <p className="text-xs font-semibold text-[#4d5240]">
                              {displayName}
                            </p>
                            <p className="text-[11px] text-[#7f785f]">Career profile</p>
                          </div>
                        </div>
                      </Link>
                      <form action={signOutAction}>
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-full border border-[#d7ccb0] bg-white/80 px-4 py-2.5 text-sm font-medium text-[#5c614c] transition hover:bg-white"
                        >
                          Logout
                        </button>
                      </form>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signin"
                        className="inline-flex items-center justify-center rounded-full bg-[#74824a] px-5 py-2.5 text-sm font-semibold text-[#f8f3e3] shadow-sm transition hover:bg-[#65743f]"
                      >
                        Anmelden
                      </Link>
                      <Link
                        href="/signup"
                        className="inline-flex items-center justify-center rounded-full border border-[#d7ccb0] bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#5c614c] transition hover:bg-white"
                      >
                        Registrieren
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </header>

            {authenticated ? (
              <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 xl:px-8">
                <SectionCard title="Letzter Lebenslauf Score" className="w-full">
                  {!latestCv ? (
                    <div className="rounded-[20px] border border-dashed border-[#d9ccb1] bg-[#faf5e9] p-6 text-center">
                      <p className="text-sm text-[#6f6a58]">
                        Noch kein Lebenslauf hochgeladen. {" "}
                        <Link href="/cv-upload" className="font-semibold text-[#74824a] underline">
                          Jetzt hochladen
                        </Link>
                      </p>
                    </div>
                  ) : !latestAnalysis ? (
                    <div className="rounded-[20px] border border-dashed border-[#d9ccb1] bg-[#faf5e9] p-6 text-center">
                      <p className="text-sm text-[#6f6a58]">
                        Für deine Lebensläufe ist noch keine gespeicherte KI-Analyse vorhanden.
                      </p>
                      <Link
                        href="/ai-analysis"
                        className="mt-3 inline-flex rounded-full bg-[#74824a] px-4 py-2 text-sm font-semibold text-[#f8f3e3] transition hover:bg-[#65743f]"
                      >
                        Analyse öffnen
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
                      <div className="flex flex-col items-center xl:min-w-52">
                        <div
                          className="relative flex h-40 w-40 items-center justify-center rounded-full"
                          style={{
                            background: `conic-gradient(#74824a 0 ${latestAnalysis.score}%, #ded4b5 ${latestAnalysis.score}% 100%)`,
                          }}
                        >
                          <div className="flex h-32 w-32 items-center justify-center rounded-full border border-[#ede2c4] bg-[#fbf7ef] text-center shadow-inner">
                            <div>
                              <p className="font-serif text-5xl leading-none text-[#4f543f]">
                                {latestAnalysis.score}
                              </p>
                              <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-[#8c8569]">
                                {latestAnalysis.score >= 80 ? "Sehr gut" : latestAnalysis.score >= 60 ? "Gut" : "Ausbaufähig"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 max-w-40 truncate text-center text-[11px] text-[#8a8467]" title={latestAnalysis.originalFilename}>
                          {latestAnalysis.originalFilename}
                        </p>
                        {latestAnalysis.analyzedAt ? (
                          <p className="mt-2 text-[11px] text-[#8a8467]">
                            Analysiert am {latestAnalysis.analyzedAt.toLocaleDateString("de-DE")}
                          </p>
                        ) : null}
                      </div>

                      <div className="grid min-w-0 flex-1 gap-4 md:grid-cols-3">
                        {[
                          { label: "Stärken", items: latestAnalysis.strengths },
                          { label: "Schwachstellen", items: latestAnalysis.weaknesses },
                          { label: "Empfehlungen", items: latestAnalysis.improvements },
                        ].map(({ label, items }) => (
                          <div key={label} className="overflow-hidden rounded-[20px] border border-[#e4d8bc] bg-white/70 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8a8467]">
                              {label}
                            </p>
                            {items.length > 0 ? (
                              <ul className="mt-3 space-y-2">
                                {items.map((item) => (
                                  <li key={item} className="flex gap-2 text-sm leading-6 text-[#4f5341]">
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#74824a]" />
                                    <span className="min-w-0 wrap-break-word">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-3 text-sm text-[#7c765d]">Keine Angaben gespeichert.</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </SectionCard>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        ["Lebensläufe", String(cvCount)],
                        ["Letzte Analyse", latestAnalysis?.analyzedAt ? latestAnalysis.analyzedAt.toLocaleDateString("de-DE") : "—"],
                        ["Job-Matches", String(topMatches.length)],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-[28px] border border-[#e5dcc1] bg-white/75 p-5 text-center shadow-[0_14px_40px_rgba(116,101,65,0.07)] backdrop-blur"
                        >
                          <p className="text-[10px] uppercase tracking-[0.35em] text-[#8a8467]">
                            {label}
                          </p>
                          <p className="mt-3 font-serif text-4xl text-[#4f543f]">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                      <SectionCard title="CV Details">
                        {latestCv ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-3 rounded-[18px] border border-[#e4d8bc] bg-white/70 px-4 py-3">
                              <p className="text-sm font-medium text-[#4f5341]">Datei</p>
                              <p className="min-w-0 truncate text-right text-xs text-[#7c765d]" title={latestCv.originalFilename}>
                                {latestCv.originalFilename}
                              </p>
                            </div>
                            <div className="flex items-center justify-between gap-3 rounded-[18px] border border-[#e4d8bc] bg-white/70 px-4 py-3">
                              <p className="text-sm font-medium text-[#4f5341]">Größe</p>
                              <p className="text-xs text-[#7c765d]">
                                {Math.max(1, Math.round(Number(latestCv.fileSizeBytes) / 1024))} KB
                              </p>
                            </div>
                            <div className="flex items-center justify-between gap-3 rounded-[18px] border border-[#e4d8bc] bg-white/70 px-4 py-3">
                              <p className="text-sm font-medium text-[#4f5341]">Hochgeladen</p>
                              <p className="text-xs text-[#7c765d]">
                                {latestCv.createdAt.toLocaleDateString("de-DE")}
                              </p>
                            </div>
                            <div className="flex items-center justify-between gap-3 rounded-[18px] border border-[#e4d8bc] bg-white/70 px-4 py-3">
                              <p className="text-sm font-medium text-[#4f5341]">Analyse</p>
                              <p className="text-xs font-semibold text-[#627146]">
                                {latestAnalysis ? "Gespeichert" : "Nicht vorhanden"}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-[#6f6a58]">Kein CV hochgeladen.</p>
                        )}
                      </SectionCard>

                      <SectionCard title="Aktivitäten">
                        <div className="space-y-3">
                          {activities.length === 0 ? (
                            <p className="text-sm text-[#6f6a58]">Noch keine Aktivitäten.</p>
                          ) : (
                            activities.map((activity) => (
                              <div key={activity.title} className="overflow-hidden">
                                <p className="truncate text-sm font-medium text-[#4d5240]" title={activity.title}>
                                  {activity.title}
                                </p>
                                <p className="mt-1 truncate text-xs text-[#8d8569]" title={activity.time}>
                                  {activity.time}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </SectionCard>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <SectionCard title="Top Matches">
                      <div className="space-y-3">
                        {topMatches.length === 0 ? (
                          <p className="text-sm text-[#6f6a58]">
                            Lade einen Lebenslauf hoch, um deine Top-Matches zu sehen.
                          </p>
                        ) : topMatches.map((job) => (
                          <div
                            key={job.id}
                            className="flex items-center justify-between gap-3 overflow-hidden rounded-[20px] border border-[#e4dabc] bg-white/70 px-3 py-3"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-[#4d5240]" title={job.title}>
                                {job.title}
                              </p>
                              <p className="truncate text-xs text-[#827a61]" title={job.company}>
                                {job.company}
                              </p>
                            </div>
                            <div className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d8cfb3] text-xs font-semibold text-[#667045]">
                              {job.matchScore}%
                            </div>
                          </div>
                        ))}
                        <Link
                          href="/jobs"
                          className="mt-3 block rounded-full border border-[#d7ccb0] bg-white/70 px-4 py-2 text-center text-xs font-medium text-[#6e7456] transition hover:bg-white"
                        >
                          Alle Jobs anzeigen
                        </Link>
                      </div>
                    </SectionCard>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center px-4 py-8 lg:px-6">
                <div className="w-full max-w-2xl rounded-[28px] border border-[#e5dcc1] bg-white/75 p-8 text-center shadow-[0_14px_40px_rgba(116,101,65,0.07)] backdrop-blur">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#8d8667]">
                    Zugang erforderlich
                  </p>
                  <h2 className="mt-3 font-serif text-4xl text-[#4d5240]">
                    Bitte anmelden
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6f6a58]">
                    Die Dashboard-Details, Empfehlungen und Match-Analysen sind nur nach dem Login sichtbar.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      
    </main>
    <SiteFooter/>
    </div>
  );
}
