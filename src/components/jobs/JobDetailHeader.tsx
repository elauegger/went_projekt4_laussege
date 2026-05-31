import Link from 'next/link';
import type { Job } from '@/types/job';
import { JobPanel } from './JobPanel';
import { JobTag } from './JobTag';

const formatDate = (value: string) => value.split('T')[0] ?? value;

export const JobDetailHeader = ({ job }: { job: Job }) => (
  <JobPanel className="p-7">
    <div className="flex flex-wrap items-start justify-between gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-muted)]">
          Jobdetails
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--color-ink)]">
          {job.title}
        </h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          {job.company} · {job.location}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <JobTag label={job.employmentType} />
          <JobTag label={job.seniority} tone="outline" />
          {job.remote ? <JobTag label="Remote" tone="accent" /> : null}
        </div>
        <p className="mt-4 text-xs text-[var(--color-muted)]">
          Erstellt am {formatDate(job.createdAt)}
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 sm:items-end">
        <Link
          href="/jobs"
          className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-xs font-semibold text-[var(--color-olive-strong)]"
        >
          Zurueck zur Uebersicht
        </Link>
        <button
          type="button"
          className="rounded-full bg-[var(--color-olive)] px-5 py-2 text-sm font-semibold text-white"
        >
          Jetzt bewerben
        </button>
      </div>
    </div>
  </JobPanel>
);
