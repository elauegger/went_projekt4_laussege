import type { Job } from '../../types/job';
import { JobCard } from './JobCard';

type JobListProps = {
  jobs: Job[];
};

export const JobList = ({ jobs }: JobListProps) => (
  <div className="grid gap-6 lg:grid-cols-2">
    {jobs.map((job) => (
      <JobCard key={job.id} job={job} />
    ))}
  </div>
);
