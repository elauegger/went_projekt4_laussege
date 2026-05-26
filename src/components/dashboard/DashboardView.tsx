import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileText,
  Hand,
  LayoutGrid,
  Menu,
  MessageSquare,
  Scale,
  Search,
  Settings,
  Sparkles,
  Sun,
  Tag,
  Target,
  Trophy,
} from 'lucide-react';

const AppIcon = ({
  icon: Icon,
  className = 'h-[18px] w-[18px]',
}: {
  icon: LucideIcon;
  className?: string;
}) => <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;

type NavItem = { label: string; href: string; active?: boolean; icon: LucideIcon };

type Criterion = { label: string; score: number; icon: LucideIcon };

type Improvement = {
  title: string;
  detail: string;
  priority: 'high' | 'mid' | 'low';
  label: string;
  icon: LucideIcon;
};

type MatchItem = {
  role: string;
  company: string;
  match: number;
  logo: string;
  logoClass: string;
};

type Activity = { title: string; detail: string; time: string; icon: LucideIcon };

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '#dashboard', active: true, icon: LayoutGrid },
  { label: 'Lebenslaeufe', href: '#analyse', icon: FileText },
  { label: 'Analyse', href: '#analyse', icon: BarChart3 },
  { label: 'Verbesserungen', href: '#verbesserungen', icon: Sparkles },
  { label: 'Job-Matching', href: '#job-matching', icon: Target },
  { label: 'Vergleich', href: '#vergleich', icon: Scale },
  { label: 'Einstellungen', href: '#aktivitaeten', icon: Settings },
];

const criteria: Criterion[] = [
  { label: 'Struktur', score: 90, icon: LayoutGrid },
  { label: 'Sprache', score: 85, icon: MessageSquare },
  { label: 'Keywords', score: 80, icon: Tag },
  { label: 'Vollstaendigkeit', score: 88, icon: CheckCircle2 },
  { label: 'Lesbarkeit', score: 82, icon: Eye },
];

const improvements: Improvement[] = [
  {
    title: 'Fuege mehr quantifizierbare Erfolge hinzu',
    detail: 'Verwende Zahlen und messbare Ergebnisse.',
    priority: 'high',
    label: 'Hoch',
    icon: Trophy,
  },
  {
    title: 'Ergaenze relevante Keywords',
    detail: 'Fuege Begriffe wie CI/CD, Docker, AWS hinzu.',
    priority: 'mid',
    label: 'Mittel',
    icon: Tag,
  },
  {
    title: 'Verbessere die Struktur im Erfahrungsteil',
    detail: 'Halte eine einheitliche Formatierung ein.',
    priority: 'low',
    label: 'Niedrig',
    icon: LayoutGrid,
  },
];

const matches: MatchItem[] = [
  {
    role: 'Software Engineer (m/w/d)',
    company: 'Tech Solutions GmbH',
    match: 92,
    logo: 'TS',
    logoClass: 'bg-[#2f372b] text-white',
  },
  {
    role: 'Full Stack Developer',
    company: 'Digital Innovations AG',
    match: 88,
    logo: 'DI',
    logoClass: 'bg-[#ebe6dc] text-[var(--color-olive-strong)]',
  },
  {
    role: 'Backend Developer',
    company: 'CodeCraft GmbH',
    match: 85,
    logo: 'CC',
    logoClass: 'bg-[#3a4334] text-white',
  },
  {
    role: 'Web Developer (m/w/d)',
    company: 'WebWorks GmbH',
    match: 82,
    logo: 'WW',
    logoClass: 'bg-[#ece6dc] text-[var(--color-olive-strong)]',
  },
  {
    role: 'Junior Software Engineer',
    company: 'NextGen Software',
    match: 78,
    logo: 'NG',
    logoClass: 'bg-[#e2dccf] text-[var(--color-olive-strong)]',
  },
];

const comparisonRows = [
  { label: 'Klarheit', without: 72, with: 90 },
  { label: 'Vollstaendigkeit', without: 68, with: 88 },
  { label: 'Job-Relevanz', without: 75, with: 92 },
];

const activities: Activity[] = [
  {
    title: 'Lebenslauf analysiert',
    detail: 'Software Engineer.pdf',
    time: 'Heute, 10:30',
    icon: FileText,
  },
  {
    title: 'Job-Matching durchgefuehrt',
    detail: '5 neue passende Jobs gefunden',
    time: 'Heute, 10:28',
    icon: Search,
  },
  {
    title: 'Verbesserungsvorschlaege generiert',
    detail: '10 Vorschlaege verfuegbar',
    time: 'Heute, 10:25',
    icon: Sparkles,
  },
];

const leafPattern =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='0.18' stroke-width='1.5'%3E%3Cpath d='M130,30c-25,20-38,48-38,85c35,0,64-12,88-34c-10-20-28-38-50-51z'/%3E%3Cpath d='M85,90c-20,14-32,32-36,58c28,6,50,0,68-18c-6-12-18-26-32-40z'/%3E%3C/g%3E%3C/svg%3E";

const matchRadius = 20;
const matchCircumference = 2 * Math.PI * matchRadius;

const priorityStyles: Record<string, string> = {
  high: 'bg-[var(--color-chip-high)] text-[var(--color-chip-ink)]',
  mid: 'bg-[var(--color-chip-mid)] text-[var(--color-chip-ink)]',
  low: 'bg-[var(--color-chip-low)] text-[var(--color-chip-ink)]',
};

const logoSrc = '/jobsy-logo.svg';
const uploadInputId = 'resume-upload';
const assistantFormId = 'assistant-form';
const cardBaseClass =
  'rounded-[24px] border border-[#D9D1C7]/40 bg-[#FAF7F2] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)]';

type DashboardViewProps = {
  displayName: string;
  name: string;
  email: string;
  initials: string;
};

const Sidebar = ({
  displayName,
  email,
  initials,
}: {
  displayName: string;
  email: string;
  initials: string;
}) => (
  <aside className="hidden lg:sticky lg:top-4 lg:flex lg:w-[220px] lg:flex-col">
    <div className="relative flex h-full flex-col rounded-[24px] bg-[linear-gradient(180deg,#6D7C59_0%,#556347_100%)] p-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
      <div className="pointer-events-none absolute inset-3 rounded-[22px] bg-white/5" />
      <div
        className="pointer-events-none absolute -bottom-10 -left-8 h-44 w-44 opacity-30"
        style={{
          backgroundImage: `url('${leafPattern}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
      />
      <div className="relative z-10 flex h-full flex-col">
        <div>
          <div className="flex items-center gap-2">
            <img src={logoSrc} alt="Jobsy logo" className="h-7 w-auto" />
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
              <AppIcon icon={Sun} className="h-[14px] w-[14px] text-white/80" />
            </span>
          </div>
          <p className="mt-2 text-[12px] text-white/70">
            Dein Karriere-Kompass fuer smarte Bewerbungen.
          </p>
        </div>

        <nav className="mt-6 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex h-12 items-center gap-3 rounded-2xl px-3 text-[13px] font-semibold transition ${
                item.active
                  ? 'bg-white/10 text-white backdrop-blur-md'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/10">
                <AppIcon icon={item.icon} className="text-white" />
              </span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="rounded-[20px] border border-white/15 bg-white/10 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[11px] font-semibold text-white">
                {initials}
              </div>
              <div className="flex-1">
                <div className="text-[12px] font-semibold">{displayName}</div>
                <div className="text-[10px] text-white/70">{email}</div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white/80">
                <AppIcon icon={ChevronRight} className="h-[14px] w-[14px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
);

const MobileHeader = ({
  initials,
  uploadInputId,
}: {
  initials: string;
  uploadInputId: string;
}) => (
  <div className="lg:hidden space-y-4">
    <div className="flex items-center justify-between gap-3 rounded-[24px] border border-[#D9D1C7]/40 bg-[#FAF7F2] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-2">
        <img src={logoSrc} alt="Jobsy logo" className="h-6 w-auto" />
        <div className="font-display text-lg">Jobsy</div>
      </div>
      <div className="flex items-center gap-2">
        <label
          htmlFor={uploadInputId}
          role="button"
          aria-label="Lebenslauf hochladen"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[var(--color-olive)] text-sm font-semibold text-white"
        >
          +
        </label>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9D1C7]/40 bg-white text-[var(--color-olive-strong)]"
        >
          <AppIcon icon={Bell} className="h-[18px] w-[18px]" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ring)] text-xs font-semibold text-[var(--color-olive-strong)]">
          {initials}
        </div>
      </div>
    </div>
    <details className="group rounded-[22px] border border-[#D9D1C7]/40 bg-[#FAF7F2] shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
      <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-xs font-semibold text-[var(--color-muted)] [&::-webkit-details-marker]:hidden">
        Navigation
        <AppIcon
          icon={Menu}
          className="h-4 w-4 text-[var(--color-olive-strong)] transition group-open:rotate-90"
        />
      </summary>
      <div className="border-t border-[#D9D1C7]/40 px-3 py-3">
        <div className="grid gap-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`rounded-2xl px-4 py-2 text-xs font-semibold transition ${
                item.active
                  ? 'bg-[var(--color-olive)] text-white'
                  : 'bg-[var(--color-surface-strong)] text-[var(--color-muted)]'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </details>
  </div>
);

const Header = ({
  name,
  initials,
  uploadInputId,
}: {
  name: string;
  initials: string;
  uploadInputId: string;
}) => (
  <header className={`${cardBaseClass} flex max-h-[110px] flex-wrap items-center justify-between gap-6`}>
    <div>
      <div className="flex items-center gap-2 font-display text-[44px] leading-none tracking-[-0.04em]">
        <span className="font-semibold">Hallo {name}!</span>
        <span className="text-[var(--color-olive)]">
          <AppIcon icon={Hand} className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-2 text-[16px] text-[var(--color-muted)]">
        Bereit fuer deinen naechsten Karriereschritt?
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <label
        htmlFor={uploadInputId}
        role="button"
        aria-label="Lebenslauf hochladen"
        className="inline-flex h-10 cursor-pointer items-center gap-3 rounded-full bg-[var(--color-olive)] px-5 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(122,139,99,0.22)]"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[14px] leading-none">
          +
        </span>
        Lebenslauf hochladen
      </label>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D9D1C7]/40 bg-white text-[var(--color-olive-strong)]"
      >
        <AppIcon icon={Bell} className="h-[18px] w-[18px]" />
      </button>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-ring)] text-[11px] font-semibold text-[var(--color-olive-strong)]">
        {initials}
      </div>
    </div>
  </header>
);

const AnalysisCard = ({
  score,
  dash,
  circumference,
  uploadInputId,
}: {
  score: number;
  dash: number;
  circumference: number;
  uploadInputId: string;
}) => (
  <section id="analyse" className={cardBaseClass}>
    <div>
      <div className="text-[16px] font-semibold">
        Lebenslauf Analyse - Software Engineer.pdf
      </div>
      <p className="mt-2 text-[11px] text-[var(--color-muted)]">
        Analysiert am 25.04.2026
      </p>
    </div>
    <div className="mt-4 grid gap-5 lg:grid-cols-[150px_1fr]">
      <div className="flex flex-col items-center justify-center rounded-[20px] bg-[var(--color-surface-strong)] p-3">
        <div className="relative flex h-[150px] w-[150px] items-center justify-center">
          <svg className="h-full w-full" viewBox="0 0 150 150">
            <circle
              cx="75"
              cy="75"
              r="68"
              stroke="var(--color-track)"
              strokeWidth="5"
              fill="none"
            />
            <circle
              cx="75"
              cy="75"
              r="68"
              stroke="var(--color-olive)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              transform="rotate(-90 75 75)"
            />
          </svg>
          <div className="absolute text-center">
            <div className="font-display text-[52px] font-semibold leading-[1]">
              {score}
            </div>
            <div className="text-[11px] text-[var(--color-muted)]">Gesamt-Score</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-[var(--color-olive-strong)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-olive)]" />
          Sehr gut
        </div>
      </div>
      <div className="space-y-3">
        {criteria.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[var(--color-surface-strong)] text-[var(--color-olive-strong)]">
              <AppIcon icon={item.icon} />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between text-[13px] font-semibold">
                <span>{item.label}</span>
                <span className="text-[var(--color-muted)]">{item.score}/100</span>
              </div>
              <div className="mt-2 h-[5px] rounded-full bg-[var(--color-track)]">
                <div
                  className="h-[5px] rounded-full bg-[var(--color-olive)]"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="h-10 rounded-full border border-[#D9D1C7]/40 bg-white px-5 text-[14px] font-semibold text-[var(--color-olive-strong)]"
      >
        Details anzeigen
      </button>
      <label
        htmlFor={uploadInputId}
        role="button"
        aria-label="Neuanalyse starten"
        className="flex h-10 cursor-pointer items-center rounded-full bg-[var(--color-olive)] px-5 text-[14px] font-semibold text-white"
      >
        Neuanalyse starten
      </label>
    </div>
  </section>
);

const MatchesCard = () => (
  <section id="job-matching" className={cardBaseClass}>
    <div className="flex items-center justify-between">
      <div className="text-[16px] font-semibold">Top Job-Matches</div>
      <button
        type="button"
        className="text-[11px] font-semibold text-[var(--color-olive-strong)]"
      >
        Alle anzeigen
      </button>
    </div>
    <div className="mt-3 divide-y divide-[#D9D1C7]/40">
      {matches.map((match) => (
        <div
          key={match.role}
          className="flex h-[72px] items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl text-[12px] font-semibold ${
                match.logoClass
              }`}
            >
              {match.logo}
            </div>
            <div>
              <div className="text-[13px] font-semibold">{match.role}</div>
              <div className="text-[11px] text-[var(--color-muted)]">{match.company}</div>
            </div>
          </div>
          <div className="relative h-12 w-12">
            <svg className="h-full w-full" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r={matchRadius}
                stroke="var(--color-track)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r={matchRadius}
                stroke="var(--color-olive)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(match.match / 100) * matchCircumference} ${matchCircumference}`}
                transform="rotate(-90 24 24)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-[var(--color-olive-strong)]">
              {match.match}%
            </div>
          </div>
        </div>
      ))}
    </div>
    <button
      type="button"
      className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#D9D1C7]/40 bg-white px-4 text-[14px] font-semibold text-[var(--color-olive-strong)]"
    >
      Alle Matches anzeigen
      <AppIcon icon={ArrowRight} className="h-[16px] w-[16px]" />
    </button>
  </section>
);

const ImprovementsCard = () => (
  <section
    id="verbesserungen"
    className={`${cardBaseClass} flex h-full min-h-[220px] flex-col`}
  >
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-[16px] font-semibold">Verbesserungsvorschlaege</div>
        <div className="mt-2 text-[11px] text-[var(--color-muted)]">
          10 konkrete Vorschlaege
        </div>
      </div>
      <button
        type="button"
        className="h-10 rounded-full border border-[#D9D1C7]/40 bg-white px-4 text-[14px] font-semibold text-[var(--color-olive-strong)]"
      >
        Alle Vorschlaege anzeigen
      </button>
    </div>
    <div className="mt-4 space-y-3">
      {improvements.map((item) => (
        <div
          key={item.title}
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#D9D1C7]/40 bg-[#FAF7F2] p-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface-strong)] text-[var(--color-olive-strong)]">
              <AppIcon icon={item.icon} />
            </span>
            <div>
              <div className="text-[13px] font-semibold">{item.title}</div>
              <div className="text-[11px] text-[var(--color-muted)]">{item.detail}</div>
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
              priorityStyles[item.priority]
            }`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  </section>
);

const ComparisonCard = () => (
  <section id="vergleich" className={`${cardBaseClass} flex h-full min-h-[220px] flex-col`}>
    <div className="text-[16px] font-semibold">
      Vergleich: Mit KI vs. Ohne KI
    </div>
    <div className="mt-4 rounded-[20px] border border-[#D9D1C7]/40 bg-[#FAF7F2] p-4">
      <div className="grid grid-cols-[1fr_auto_auto] text-[11px] font-semibold text-[var(--color-muted)]">
        <span>Kriterium</span>
        <span>Ohne KI</span>
        <span>Mit KI</span>
      </div>
      <div className="mt-4 space-y-3 text-[13px]">
        {comparisonRows.map((row) => (
          <div key={row.label} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
            <span className="font-semibold">{row.label}</span>
            <span className="text-[var(--color-muted)]">{row.without}/100</span>
            <span className="font-semibold text-[var(--color-olive-strong)]">
              {row.with}/100
            </span>
          </div>
        ))}
      </div>
    </div>
    <div className="mt-auto flex items-center gap-2 rounded-2xl bg-[var(--color-surface-strong)] px-4 py-3 text-[11px] text-[var(--color-olive-strong)]">
      <AppIcon icon={ArrowRight} className="h-[16px] w-[16px]" />
      <span>
        Verbesserungspotenzial: +22% hoehere Chance auf ein Vorstellungsgespraech
      </span>
    </div>
  </section>
);

const ActivitiesCard = () => (
  <section id="aktivitaeten" className={`${cardBaseClass} flex h-full min-h-[220px] flex-col`}>
    <div className="flex items-center justify-between">
      <div className="text-[16px] font-semibold">Letzte Aktivitaeten</div>
      <button
        type="button"
        className="text-[11px] font-semibold text-[var(--color-olive-strong)]"
      >
        Alle Aktivitaeten anzeigen
      </button>
    </div>
    <div className="mt-4 space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.title}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#D9D1C7]/40 bg-[#FAF7F2] px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-strong)] text-[var(--color-olive-strong)]">
              <AppIcon icon={activity.icon} />
            </span>
            <div>
              <div className="text-[13px] font-semibold">{activity.title}</div>
              <div className="text-[11px] text-[var(--color-muted)]">{activity.detail}</div>
            </div>
          </div>
          <div className="text-[11px] text-[var(--color-muted)]">{activity.time}</div>
        </div>
      ))}
    </div>
  </section>
);

const AssistantCard = () => (
  <section id="assistant" className={`${cardBaseClass} flex flex-wrap items-center justify-between gap-4`}>
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface-strong)] text-[var(--color-olive-strong)]">
        <AppIcon icon={Sparkles} className="h-[18px] w-[18px]" />
      </span>
      <div className="font-display text-[16px] font-semibold">Jobsy KI-Assistent</div>
    </div>
    <form id={assistantFormId} action="#assistant" method="get">
      <button
        type="submit"
        className="h-10 rounded-full bg-[var(--color-olive-strong)] px-5 text-[14px] font-semibold text-white"
      >
        Jetzt fragen
      </button>
    </form>
  </section>
);

export const DashboardView = ({
  displayName,
  name,
  email,
  initials,
}: DashboardViewProps) => {
  const score = 87;
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="h-screen overflow-hidden bg-[var(--color-canvas)] text-[var(--color-ink)]">
      <div className="mx-auto flex h-full w-full max-w-[1440px] gap-4 px-6 py-4">
        <Sidebar displayName={displayName} email={email} initials={initials} />

        <main id="dashboard" className="flex min-h-0 flex-1 flex-col space-y-4 overflow-hidden">
          <input
            id={uploadInputId}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf"
            className="sr-only"
            aria-label="Lebenslauf hochladen"
          />
          <MobileHeader initials={initials} uploadInputId={uploadInputId} />
          <Header name={name} initials={initials} uploadInputId={uploadInputId} />

          <div className="grid gap-4 lg:grid-cols-[1.6fr_0.9fr]">
            <AnalysisCard
              score={score}
              dash={dash}
              circumference={circumference}
              uploadInputId={uploadInputId}
            />
            <MatchesCard />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <ImprovementsCard />
            <ComparisonCard />
            <ActivitiesCard />
          </div>
          <AssistantCard />
        </main>
      </div>
    </div>
  );
};
