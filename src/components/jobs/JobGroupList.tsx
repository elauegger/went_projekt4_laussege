import type { Job } from '../../types/job';
import { JobList } from './JobList';

const groupOrder: Job['employmentType'][] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
];

const groupLabels: Record<Job['employmentType'], string> = {
  'Full-time': 'Full-time Rollen',
  'Part-time': 'Part-time Rollen',
  Contract: 'Contract Rollen',
  Internship: 'Internship Rollen',
  Remote: 'Remote Rollen',
};

type JobGroupListProps = {
  jobs: Job[];
};

export const JobGroupList = ({ jobs }: JobGroupListProps) => {
  const grouped = groupOrder
    .map((type) => ({
      type,
      jobs: jobs.filter((job) => job.employmentType === type),
    }))
    .filter((group) => group.jobs.length > 0);

  return (
    <div className="space-y-10">
      {grouped.map((group) => (
        <section key={group.type} className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-muted)]">
              {groupLabels[group.type]}
            </h2>
            <span className="h-px flex-1 bg-[var(--color-line)]" />
            <span className="text-xs text-[var(--color-muted)]">
              {group.jobs.length}
            </span>
          </div>
          <JobList jobs={group.jobs} />
        </section>
      ))}
    </div>
  );
};
