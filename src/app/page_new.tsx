'use client';

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { signOutAction } from "./actions/auth";

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
];

const progressRows = [
  { label: "Struktur", value: 92 },
  { label: "Sprache", value: 88 },
  { label: "Keywords", value: 81 },
  { label: "Vollständigkeit", value: 76 },
  { label: "Lesbarkeit", value: 94 },
];

const jobMatches = [
  { company: "SC", title: "Software Engineer", match: 97 },
  { company: "DT", title: "Full Stack Developer", match: 91 },
  { company: "NB", title: "Backend Developer", match: 84 },
  { company: "WG", title: "Web Developer", match: 79 },
  { company: "JN", title: "Junior Software Engineer", match: 73 },
];

const suggestions = [
  { title: "Projektfokus schärfen", level: "Hoch", tone: "high" },
  { title: "ATS-Keywords ergänzen", level: "Mittel", tone: "medium" },
  { title: "Erfolge messbar formulieren", level: "Niedrig", tone: "low" },
];

const activities = [
  { title: "Lebenslauf analysiert", time: "Heute, 09:24" },
  { title: "Job-Match neu berechnet", time: "Heute, 09:30" },
  { title: "Verbesserungsvorschläge aktualisiert", time: "Heute, 09:41" },
  { title: "Export als PDF vorbereitet", time: "Heute, 10:02" },
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

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#74824a] text-[#f8f3e3] shadow-[0_10px_30px_rgba(116,130,74,0.3)] transition hover:bg-[#65743f] lg:hidden"
        aria-label="Navigation öffnen"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <nav className="fixed bottom-0 left-0 right-0 z-40 space-y-2 rounded-t-[28px] border border-[#dccfb0] bg-[#75824e]/95 px-4 py-6 text-[#f8f1de] backdrop-blur-sm lg:hidden">
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#f0e5bf]/70">Navigation</p>
            </div>
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${item.active
                  ? "bg-[#f3ebcf] text-[#55603a] shadow-sm"
                  : "text-[#efe7c8] hover:bg-white/8"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <NavGlyph active={item.active} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </>
      )}
    </>
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

export default function Home() {
  const displayName = "User";
  const authenticated = false;

  return (
    <main className="min-h-screen px-3 py-3 text-[#2f3628] sm:px-5 sm:py-5 lg:px-6">
      <div className="relative mx-auto min-h-[calc(100vh-1.5rem)] max-w-screen-2xl overflow-hidden rounded-[36px] border border-[#d9ceb1] bg-[#f6f0e6] shadow-[0_24px_90px_rgba(98,87,55,0.14)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-5%] top-[-8%] h-72 w-72 rounded-full bg-[#8e9a63]/12 blur-3xl" />
          <div className="absolute right-[8%] top-[10%] h-96 w-96 rounded-full bg-[#e9d972]/18 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[18%] h-80 w-80 rounded-full bg-[#d8c9a5]/18 blur-3xl" />
        </div>

        <div className="relative grid min-h-[calc(100vh-1.5rem)] lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="hidden border-r border-[#dccfb0] bg-[#75824e]/92 text-[#f8f1de] lg:flex lg:flex-col">
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

            <div className="px-4 pb-4">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#f3e5bd]/14 p-5">
                <div className="absolute -right-6 bottom-0 h-28 w-28 opacity-90">
                  <LeafMark />
                </div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#f0e5bf]/70">
                  Profi-Tipp
                </p>
                <p className="mt-4 max-w-56 text-sm leading-6 text-[#f8f0d3]">
                  Formuliere Erfolge messbar, halte Lebensläufe kurz und nutze
                  dieselbe Wortwahl wie die Zielrolle.
                </p>
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col">
            <MobileNav />

            <header className="border-b border-[#e2d7bc] bg-[#fbf8f0]/75 px-4 py-4 backdrop-blur md:px-6 lg:px-8">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.42em] text-[#8d8667]">
                    Karriere-Analyse Studio
                  </p>
                  <h1 className="mt-3 font-serif text-4xl leading-tight text-[#4d5240] sm:text-5xl">
                    Hallo {displayName}!
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f6a58] sm:text-base">
                    Dein Dashboard ist bereit. Melde dich an, lade deinen Lebenslauf hoch und analysiere passende Karrierechancen.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                  <Link
                    href="/cv-upload"
                    className="inline-flex items-center justify-center rounded-full bg-[#74824a] px-5 py-2.5 text-sm font-semibold text-[#f8f3e3] shadow-sm transition hover:bg-[#65743f]"
                  >
                    Lebenslauf hochladen
                  </Link>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d7ccb0] bg-white/80 text-[#66714a] transition hover:bg-white"
                    aria-label="Benachrichtigungen"
                  >
                    <span className="text-lg">◌</span>
                  </button>
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
                  {authenticated ? (
                    <form action={signOutAction}>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-full border border-[#d7ccb0] bg-white/80 px-4 py-2.5 text-sm font-medium text-[#5c614c] transition hover:bg-white"
                      >
                        Logout
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            </header>

            <div className="grid flex-1 gap-6 px-4 py-6 lg:px-6 xl:grid-cols-3 xl:px-8">
              {/* LEFT COLUMN */}
              <div className="space-y-6 xl:col-span-2">
                <SectionCard title="Lebenslauf Score">
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <div className="flex flex-col items-center">
                      <div
                        className="relative flex h-40 w-40 items-center justify-center rounded-full"
                        style={{
                          background:
                            "conic-gradient(#74824a 0 87%, #ded4b5 87% 100%)",
                        }}
                      >
                        <div className="flex h-32 w-32 items-center justify-center rounded-full border border-[#ede2c4] bg-[#fbf7ef] text-center shadow-inner">
                          <div>
                            <p className="font-serif text-5xl leading-none text-[#4f543f]">
                              87
                            </p>
                            <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-[#8c8569]">
                              Sehr gut
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      {progressRows.map((row) => (
                        <div key={row.label}>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-[#5c614c]">{row.label}</span>
                            <span className="font-medium text-[#7c8a53]">{row.value}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-[#e8dfc7]">
                            <div
                              className="h-2 rounded-full bg-[#7c8a53]"
                              style={{ width: `${row.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionCard>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ["ATS Match", "91%"],
                    ["Keywords", "24"],
                    ["Verbesserungen", "+12"],
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
                  <SectionCard title="Verbesserungsvorschläge">
                    <div className="space-y-3">
                      {suggestions.map((item) => (
                        <div
                          key={item.title}
                          className="rounded-[22px] border border-[#e4d9bc] bg-[#fffdf7] p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-[#4f5341]">{item.title}</p>
                              <p className="mt-1 text-xs text-[#807a61]">
                                KI-basierter Hinweis
                              </p>
                            </div>
                            <span
                              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${item.tone === "high"
                                ? "bg-[#efe4bf] text-[#6d5e2b]"
                                : item.tone === "medium"
                                  ? "bg-[#e4ebd2] text-[#617046]"
                                  : "bg-[#f0ebe0] text-[#7d775f]"
                                }`}
                            >
                              {item.level}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="KI Vergleich">
                    <div className="space-y-3">
                      {[
                        ["ATS-Score", "64", "87"],
                        ["Lesbarkeit", "68", "94"],
                        ["Keywords", "12", "24"],
                        ["Recruiter Fit", "71", "91"],
                      ].map(([label, before, after]) => (
                        <div key={label} className="flex items-center justify-between rounded-[18px] border border-[#e4d8bc] bg-white/70 px-4 py-3">
                          <p className="text-sm font-medium text-[#4f5341]">{label}</p>
                          <div className="flex gap-3 text-xs">
                            <span className="text-[#7c765d]">{before}</span>
                            <span className="text-[#627146] font-semibold">→ {after}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <SectionCard title="Top Matches">
                  <div className="space-y-3">
                    {jobMatches.slice(0, 3).map((job) => (
                      <div
                        key={job.title}
                        className="flex items-center justify-between rounded-[20px] border border-[#e4dabc] bg-white/70 px-3 py-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#4d5240] truncate">
                            {job.title}
                          </p>
                          <p className="text-xs text-[#827a61]">{job.company}</p>
                        </div>
                        <div className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d8cfb3] text-xs font-semibold text-[#667045]">
                          {job.match}%
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

                <SectionCard title="Aktivitäten">
                  <div className="space-y-3">
                    {activities.slice(0, 3).map((activity) => (
                      <div key={activity.title}>
                        <p className="text-sm font-medium text-[#4d5240]">{activity.title}</p>
                        <p className="mt-1 text-xs text-[#8d8569]">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Nächster Schritt">
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed text-[#67614c]">
                      Der Lebenslauf ist strukturell stark. Zusätzliche Keywords
                      und präzisere Erfolgsformulierungen helfen weiter.
                    </p>
                    <Link
                      href="/cv-upload"
                      className="inline-flex rounded-full bg-[#74824a] px-4 py-2 text-sm font-semibold text-[#f8f3e3] transition hover:bg-[#65743f]"
                    >
                      Upload öffnen
                    </Link>
                  </div>
                </SectionCard>

                {!authenticated ? (
                  <SectionCard title="Zugriff">
                    <p className="mb-4 text-sm text-[#67614c]">
                      Melde dich an, um Uploads zu speichern.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/signin"
                        className="rounded-full border border-[#d8cfb1] bg-white px-3 py-2 text-center text-sm font-medium text-[#5d6547] transition hover:bg-[#f7f2e3]"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className="rounded-full bg-[#74824a] px-3 py-2 text-center text-sm font-semibold text-[#f8f3e3] transition hover:bg-[#65743f]"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </SectionCard>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
