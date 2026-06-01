import type { Job } from '../../types/job';
import { JobPanel } from './JobPanel';
import { JobTag } from './JobTag';

const formatDate = (value: string) => value.split('T')[0] ?? value;

export const JobDetailHeader = ({ job }: { job: Job }) => (
  <JobPanel className="p-8">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-muted)]">
          {job.company}
        </p>
        <h1 className="mt-4 font-serif text-4xl text-[var(--color-ink)] sm:text-5xl">
          {job.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)] sm:text-base">
          {job.location}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <JobTag label={job.employmentType} />
        <JobTag label={job.seniority} tone="outline" />
        {job.remote ? <JobTag label="Remote" tone="accent" /> : null}
      </div>
    </div>

    <p className="mt-6 text-xs text-[var(--color-muted)]">
      Erstellt am {formatDate(job.createdAt)}
    </p>
  </JobPanel>
);
