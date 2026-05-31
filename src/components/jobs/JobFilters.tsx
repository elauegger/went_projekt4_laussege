import { JobPanel } from './JobPanel';

export type JobFilterValues = {
  q?: string;
  skill?: string;
  company?: string;
  location?: string;
  employmentType?: string;
  seniority?: string;
  remote?: string;
  sort?: string;
};

type JobFiltersProps = {
  values: JobFilterValues;
};

const inputClassName =
  'w-full rounded-2xl border border-[var(--color-line)] bg-white/70 px-4 py-2 text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,99,0.35)]';

const labelClassName =
  'text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]';

export const JobFilters = ({ values }: JobFiltersProps) => (
  <JobPanel className="p-6">
    <form method="GET" className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-muted)]">
            Filter & Suche
          </p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Suche nach Titel, Company, Skills oder Keywords.
          </p>
        </div>
        <a
          href="/jobs"
          className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-xs font-semibold text-[var(--color-olive-strong)]"
        >
          Filter zuruecksetzen
        </a>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClassName} htmlFor="filter-query">
            Suche
          </label>
          <input
            id="filter-query"
            name="q"
            placeholder="z. B. React, Backend, AI"
            defaultValue={values.q ?? ''}
            className={inputClassName}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClassName} htmlFor="filter-skill">
            Skill
          </label>
          <input
            id="filter-skill"
            name="skill"
            placeholder="z. B. TypeScript"
            defaultValue={values.skill ?? ''}
            className={inputClassName}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClassName} htmlFor="filter-company">
            Company
          </label>
          <input
            id="filter-company"
            name="company"
            placeholder="z. B. Tech Solutions"
            defaultValue={values.company ?? ''}
            className={inputClassName}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClassName} htmlFor="filter-location">
            Standort
          </label>
          <input
            id="filter-location"
            name="location"
            placeholder="z. B. Berlin"
            defaultValue={values.location ?? ''}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <label className={labelClassName} htmlFor="filter-employment">
            Anstellung
          </label>
          <select
            id="filter-employment"
            name="employmentType"
            defaultValue={values.employmentType ?? ''}
            className={inputClassName}
          >
            <option value="">Alle</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClassName} htmlFor="filter-seniority">
            Senioritaet
          </label>
          <select
            id="filter-seniority"
            name="seniority"
            defaultValue={values.seniority ?? ''}
            className={inputClassName}
          >
            <option value="">Alle</option>
            <option value="Junior">Junior</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClassName} htmlFor="filter-remote">
            Remote
          </label>
          <select
            id="filter-remote"
            name="remote"
            defaultValue={values.remote ?? ''}
            className={inputClassName}
          >
            <option value="">Alle</option>
            <option value="true">Nur Remote</option>
            <option value="false">Nur Onsite</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClassName} htmlFor="filter-sort">
            Sortierung
          </label>
          <select
            id="filter-sort"
            name="sort"
            defaultValue={values.sort ?? ''}
            className={inputClassName}
          >
            <option value="">Standard</option>
            <option value="desc">Neueste zuerst</option>
            <option value="asc">Aelteste zuerst</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-full bg-[var(--color-olive)] px-5 py-2 text-sm font-semibold text-white"
        >
          Filter anwenden
        </button>
        <p className="text-xs text-[var(--color-muted)]">
          Tipp: Kombiniere Suche mit Senioritaet und Remote-Filter.
        </p>
      </div>
    </form>
  </JobPanel>
);
