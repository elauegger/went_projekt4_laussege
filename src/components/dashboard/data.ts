import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  CheckCircle2,
  Eye,
  FileText,
  LayoutGrid,
  MessageSquare,
  Scale,
  Search,
  Settings,
  Sparkles,
  Tag,
  Target,
  Trophy,
} from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
};

type ScoreCategory = {
  label: string;
  score: number;
  icon: LucideIcon;
  tone: 'olive' | 'gold' | 'sand';
};

type MatchItem = {
  id: string;
  role: string;
  company: string;
  match: number;
  logo: string;
  logoClass: string;
};

type SuggestionItem = {
  id: string;
  title: string;
  detail: string;
  priority: 'high' | 'mid' | 'low';
  label: string;
  icon: LucideIcon;
};

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  icon: LucideIcon;
};

type ComparisonRow = {
  id: string;
  label: string;
  without: number;
  withAi: number;
};

export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '#dashboard', active: true, icon: LayoutGrid },
  { label: 'Lebenslaeufe', href: '#analyse', icon: FileText },
  { label: 'Analyse', href: '#analyse', icon: BarChart3 },
  { label: 'Verbesserungen', href: '#verbesserungen', icon: Sparkles },
  { label: 'Job-Matching', href: '#job-matching', icon: Target },
  { label: 'Vergleich', href: '#vergleich', icon: Scale },
  { label: 'Einstellungen', href: '#aktivitaeten', icon: Settings },
];

export const scoreCategories: ScoreCategory[] = [
  { label: 'Struktur', score: 90, icon: LayoutGrid, tone: 'olive' },
  { label: 'Sprache', score: 85, icon: MessageSquare, tone: 'olive' },
  { label: 'Keywords', score: 80, icon: Tag, tone: 'gold' },
  { label: 'Vollstaendigkeit', score: 88, icon: CheckCircle2, tone: 'olive' },
  { label: 'Lesbarkeit', score: 82, icon: Eye, tone: 'sand' },
];

export const matches: MatchItem[] = [
  {
    id: 'match-1',
    role: 'Software Engineer (m/w/d)',
    company: 'Tech Solutions GmbH',
    match: 92,
    logo: 'TS',
    logoClass: 'bg-[#222d1e] text-[#f6f1e8]',
  },
  {
    id: 'match-2',
    role: 'Full Stack Developer',
    company: 'Digital Innovations AG',
    match: 88,
    logo: 'di',
    logoClass: 'bg-[#dce4cf] text-[var(--color-olive-strong)]',
  },
  {
    id: 'match-3',
    role: 'Backend Developer',
    company: 'CodeCraft GmbH',
    match: 85,
    logo: '</>',
    logoClass: 'bg-[#2b3423] text-[#f6f1e8]',
  },
  {
    id: 'match-4',
    role: 'Web Developer (m/w/d)',
    company: 'WebWorks GmbH',
    match: 82,
    logo: 'W',
    logoClass: 'bg-[#cfd8bf] text-[var(--color-olive-strong)]',
  },
  {
    id: 'match-5',
    role: 'Junior Software Engineer',
    company: 'NextGen Software',
    match: 78,
    logo: 'N',
    logoClass: 'bg-[#c3ceb1] text-[var(--color-olive-strong)]',
  },
];

export const suggestions: SuggestionItem[] = [
  {
    id: 'suggestion-1',
    title: 'Fuege mehr quantifizierbare Erfolge hinzu',
    detail: 'Verwende Zahlen und konkrete Ergebnisse.',
    priority: 'high',
    label: 'Hoch',
    icon: Trophy,
  },
  {
    id: 'suggestion-2',
    title: 'Ergaenze relevante Keywords',
    detail: 'Fuege Keywords wie CI/CD, Docker, AWS hinzu.',
    priority: 'mid',
    label: 'Mittel',
    icon: Tag,
  },
  {
    id: 'suggestion-3',
    title: 'Verbessere die Struktur im Erfahrungsteil',
    detail: 'Verwende eine einheitliche Formatierung.',
    priority: 'low',
    label: 'Niedrig',
    icon: LayoutGrid,
  },
];

export const comparisonRows: ComparisonRow[] = [
  { id: 'row-1', label: 'Klarheit', without: 72, withAi: 90 },
  { id: 'row-2', label: 'Vollstaendigkeit', without: 68, withAi: 88 },
  { id: 'row-3', label: 'Job-Relevanz', without: 75, withAi: 92 },
];

export const activities: ActivityItem[] = [
  {
    id: 'activity-1',
    title: 'Lebenslauf analysiert',
    detail: 'Software Engineer.pdf',
    time: 'Heute, 10:30',
    icon: FileText,
  },
  {
    id: 'activity-2',
    title: 'Job-Matching durchgefuehrt',
    detail: '5 neue passende Jobs gefunden',
    time: 'Heute, 10:28',
    icon: Search,
  },
  {
    id: 'activity-3',
    title: 'Verbesserungsvorschlaege generiert',
    detail: '10 Vorschlaege verfuegbar',
    time: 'Heute, 10:25',
    icon: Sparkles,
  },
];

export type { ActivityItem, ComparisonRow, MatchItem, NavItem, ScoreCategory, SuggestionItem };
