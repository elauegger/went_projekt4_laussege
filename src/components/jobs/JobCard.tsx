import Link from 'next/link';
import type { Job } from '../../types/job';
import { JobPanel } from './JobPanel';
import { JobTag } from './JobTag';

const formatDate = (value: string) => value.split('T')[0] ?? value;

export const JobCard = ({ job }: { job: Job }) => {
  const topSkills = job.skills.slice(0, 4);

  return (
    <JobPanel className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-muted)]">
            {job.company}
          </p>
          <h3 className="mt-2 font-serif text-2xl text-[var(--color-ink)]">
            {job.title}
          </h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {job.location}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-strong)] text-sm font-semibold text-[var(--color-olive-strong)]">
          {job.company.slice(0, 2).toUpperCase()}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <JobTag label={job.employmentType} />
        <JobTag label={job.seniority} tone="outline" />
        {job.remote ? <JobTag label="Remote" tone="accent" /> : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {topSkills.map((skill) => (
          <JobTag key={skill} label={skill} tone="outline" />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs text-[var(--color-muted)]">
          Erstellt am {formatDate(job.createdAt)}
        </span>
        <Link
          href={`/jobs/${job.id}`}
          className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-xs font-semibold text-[var(--color-olive-strong)]"
        >
          Details anzeigen
        </Link>
      </div>
    </JobPanel>
  );
};
