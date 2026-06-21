import type { Job } from '../../types/job';
import { JobCard } from './JobCard';

type JobListProps = {
  jobs: Job[];
  favoriteJobIds?: string[];
};

export const JobList = ({ jobs, favoriteJobIds = [] }: JobListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isFavorite={favoriteJobIds.includes(job.id)}
        />
      ))}
    </div>
  );
};