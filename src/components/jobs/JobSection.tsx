import type { ReactNode } from 'react';
import { JobPanel } from './JobPanel';

type JobSectionProps = {
  title: string;
  children: ReactNode;
};

export const JobSection = ({ title, children }: JobSectionProps) => (
  <JobPanel className="p-6">
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-muted)]">
        {title}
      </span>
      <span className="h-px flex-1 bg-[var(--color-line)]" />
    </div>
    <div className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
      {children}
    </div>
  </JobPanel>
);
