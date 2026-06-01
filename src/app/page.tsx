import Link from "next/link";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import { auth } from "../lib/auth";
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
  { label: "Analyse", href: "/dashboard" },
  { label: "Verbesserungen", href: "/dashboard" },
  { label: "Job-Matching", href: "/dashboard" },
  { label: "Vergleich", href: "/dashboard" },
  { label: "Einstellungen", href: "/dashboard" },
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

  const displayName = session?.user?.name?.split(" ")[0] ?? "Emily";
  const authenticated = Boolean(session);

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
              <div>
                <p className="text-[10px] uppercase tracking-[0.46em] text-[#f0e5bf]/75">
                  Jobsy
                </p>
                <p className="mt-3 font-serif text-4xl leading-none text-[#f6efd8]">
                  Jobsy
                </p>
              </div>
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

            <div className="mt-auto border-t border-white/10 px-5 py-4 text-xs text-[#f1e8c8]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#f3ebcf]" />
                <div>
                  <p className="font-medium">Emily K.</p>
                  <p className="text-[#f3ebcf]/70">hello@jobsy.app</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col">
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
                    {authenticated
                      ? "Dein Lebenslauf ist analysiert, deine Job-Matches sind sortiert und die nächsten Optimierungen sind klar priorisiert."
                      : "Dein Dashboard ist bereit. Melde dich an, lade deinen Lebenslauf hoch und analysiere passende Karrierechancen mit ruhiger Premium-UI."}
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
                  <div className="flex h-11 items-center gap-3 rounded-full border border-[#d7ccb0] bg-white/80 px-3 pr-4">
                    <div className="h-8 w-8 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f3e8c4,#b7c08b)]" />
                    <div className="hidden sm:block">
                      <p className="text-xs font-semibold text-[#4d5240]">
                        {displayName}
                      </p>
                      <p className="text-[11px] text-[#7f785f]">Career profile</p>
                    </div>
                  </div>
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

              <div className="mt-5 flex flex-wrap gap-2 lg:hidden">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${item.active
                      ? "border-[#c8be9d] bg-[#efe6cd] text-[#55603a]"
                      : "border-[#ddd2b8] bg-white/70 text-[#6d6958]"
                      }`}
                  >
                    <NavGlyph active={item.active} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </header>

            <div className="grid flex-1 gap-5 px-4 py-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:px-6 xl:px-8">
              <div className="space-y-5">
                <section className="rounded-4xl border border-[#dfd2b3] bg-[#fcfaf4]/90 p-5 shadow-[0_16px_50px_rgba(113,99,66,0.08)] sm:p-6">
                  <div className="flex flex-col gap-6 xl:flex-row">
                    <div className="flex-1 rounded-[28px] border border-[#e1d6bb] bg-white/60 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.35em] text-[#8d8667]">
                            Lebenslauf Analyse
                          </p>
                          <h2 className="mt-2 font-serif text-3xl text-[#4e5340]">
                            Software Engineer Profil
                          </h2>
                        </div>
                        <span className="rounded-full border border-[#d9cfb3] bg-[#f5edd6] px-3 py-1 text-xs font-medium text-[#71694f]">
                          Aktualisiert vor 4 min
                        </span>
                      </div>

                      <div className="mt-6 grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
                        <div className="flex flex-col items-center justify-center rounded-[28px] border border-[#e2d8bf] bg-[#faf6eb] px-6 py-8">
                          <div
                            className="relative flex h-36 w-36 items-center justify-center rounded-full"
                            style={{
                              background:
                                "conic-gradient(#74824a 0 87%, #ded4b5 87% 100%)",
                            }}
                          >
                            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#ede2c4] bg-[#fbf7ef] text-center shadow-inner sm:h-32 sm:w-32">
                              <div>
                                <p className="font-serif text-5xl leading-none text-[#4f543f]">
                                  87
                                </p>
                                <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-[#8c8569]">
                                  Core Score
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="mt-4 text-sm text-[#6f6a58]">Sehr gut</p>
                        </div>

                        <div className="space-y-4">
                          {progressRows.map((row) => (
                            <div key={row.label}>
                              <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="text-[#5c614c]">{row.label}</span>
                                <span className="text-[#807a61]">{row.value}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-[#e8dfc7]">
                                <div
                                  className="h-2 rounded-full bg-[#7c8a53]"
                                  style={{ width: `${row.value}%` }}
                                />
                              </div>
                            </div>
                          ))}

                          <div className="grid gap-3 pt-2 sm:grid-cols-3">
                            {[
                              ["ATS Match", "91%"],
                              ["Keywords", "24"],
                              ["Verbesserungen", "+12"],
                            ].map(([label, value]) => (
                              <div
                                key={label}
                                className="rounded-2xl border border-[#e3d7bc] bg-[#fffaf0] px-4 py-4"
                              >
                                <p className="text-[10px] uppercase tracking-[0.3em] text-[#928b70]">
                                  {label}
                                </p>
                                <p className="mt-3 font-serif text-3xl text-[#505543]">
                                  {value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full rounded-4xl border border-[#e1d6bb] bg-[#faf6eb] p-5 xl:w-72">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.35em] text-[#8d8667]">
                            Top Job Matches
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-[#4e5340]">
                            Passende Rollen
                          </h3>
                        </div>
                        <Link href="/cv-upload" className="text-sm text-[#74824a]">
                          Alle anzeigen
                        </Link>
                      </div>

                      <div className="mt-5 space-y-3">
                        {jobMatches.map((job) => (
                          <div
                            key={job.title}
                            className="flex items-center justify-between rounded-2xl border border-[#e4dabc] bg-white/70 px-3 py-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#77814e] text-xs font-semibold text-[#f6f0de]">
                                {job.company}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#4d5240]">
                                  {job.title}
                                </p>
                                <p className="text-xs text-[#827a61]">Tech / Remote</p>
                              </div>
                            </div>
                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8cfb3] text-sm font-semibold text-[#667045]">
                              {job.match}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid gap-5 xl:grid-cols-2">
                  <SectionCard title="Verbesserungsvorschläge">
                    <div className="space-y-3">
                      {suggestions.map((item) => (
                        <div
                          key={item.title}
                          className="flex items-start justify-between gap-4 rounded-2xl border border-[#e4d9bc] bg-[#fffdf7] px-4 py-4"
                        >
                          <div>
                            <p className="font-medium text-[#4f5341]">{item.title}</p>
                            <p className="mt-1 text-sm text-[#807a61]">
                              KI-basierter Hinweis für bessere Sichtbarkeit und
                              klare Bewerbungswirkung.
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone === "high"
                              ? "bg-[#efe4bf] text-[#6d5e2b]"
                              : item.tone === "medium"
                                ? "bg-[#e4ebd2] text-[#617046]"
                                : "bg-[#f0ebe0] text-[#7d775f]"
                              }`}
                          >
                            {item.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Vergleich mit KI vs. ohne KI">
                    <div className="overflow-hidden rounded-[22px] border border-[#e4d8bc] bg-white/70">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#f4eedf] text-[#7d775f]">
                          <tr>
                            <th className="px-4 py-3 font-medium">Kategorie</th>
                            <th className="px-4 py-3 font-medium">Ohne KI</th>
                            <th className="px-4 py-3 font-medium">Mit KI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ede3ca] text-[#4f5341]">
                          {[
                            ["ATS-Score", "64", "87"],
                            ["Lesbarkeit", "68", "94"],
                            ["Keyword-Dichte", "12", "24"],
                            ["Recruiter Fit", "71", "91"],
                          ].map(([label, before, after]) => (
                            <tr key={label}>
                              <td className="px-4 py-3 font-medium">{label}</td>
                              <td className="px-4 py-3 text-[#7c765d]">{before}</td>
                              <td className="px-4 py-3 font-semibold text-[#627146]">
                                {after}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </SectionCard>
                </div>
              </div>

              <div className="space-y-5">
                <SectionCard title="Letzte Aktivitäten">
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={activity.title} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span className="mt-1 h-3 w-3 rounded-full bg-[#7c8a53]" />
                          {index < activities.length - 1 ? (
                            <span className="mt-2 h-full w-px flex-1 bg-[#e5dcc3]" />
                          ) : null}
                        </div>
                        <div className="pb-4">
                          <p className="font-medium text-[#4d5240]">{activity.title}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[#8d8569]">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Analyse-Status">
                  <div className="rounded-[26px] border border-[#e4dabc] bg-[#f9f5ea] p-5">
                    <p className="text-sm leading-6 text-[#67614c]">
                      Der Lebenslauf ist strukturell stark, aber mit zusätzlichen
                      Schlagwörtern und präziseren Erfolgsformulierungen wirkt er
                      deutlich stärker in ATS- und Recruiter-Scans.
                    </p>

                    <div className="mt-5 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-[#8d8667]">
                          Nächster Schritt
                        </p>
                        <p className="mt-2 font-serif text-3xl text-[#4f543f]">
                          KI-Review starten
                        </p>
                      </div>
                      <Link
                        href="/cv-upload"
                        className="rounded-full bg-[#75824e] px-4 py-2.5 text-sm font-semibold text-[#f8f3e3] transition hover:bg-[#65733f]"
                      >
                        Upload öffnen
                      </Link>
                    </div>
                  </div>
                </SectionCard>

                <div className="rounded-[30px] border border-[#e0d4b9] bg-[#75824e] p-5 text-[#f8f0da] shadow-[0_14px_40px_rgba(98,87,55,0.14)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] text-[#efe5c1]/75">
                        Profi-Tipp
                      </p>
                      <p className="mt-3 max-w-[18rem] text-sm leading-6 text-[#f8f0da]">
                        Nutze konkrete Resultate statt allgemeiner Aufgaben. Das
                        macht Lebensläufe ruhiger, glaubwürdiger und deutlich
                        hochwertiger.
                      </p>
                    </div>
                    <div className="h-24 w-28 opacity-90">
                      <LeafMark />
                    </div>
                  </div>
                </div>

                {!authenticated ? (
                  <div className="rounded-[30px] border border-[#e2d8bc] bg-[#fffaf1] p-5">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#8d8667]">
                      Zugriff
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[#67614c]">
                      Melde dich an, um Uploads mit deinem Profil zu verknüpfen
                      und spätere Analyse-Features zu nutzen.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href="/signin"
                        className="rounded-full border border-[#d8cfb1] bg-white px-4 py-2 text-sm font-medium text-[#5d6547] transition hover:bg-[#f7f2e3]"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className="rounded-full bg-[#75824e] px-4 py-2 text-sm font-semibold text-[#f8f3e3] transition hover:bg-[#65733f]"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
