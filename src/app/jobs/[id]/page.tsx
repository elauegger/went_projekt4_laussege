import { notFound } from 'next/navigation';
import { getJobById, getAllJobs } from '@/lib/jobs';
import { JobDetailHeader } from '@/components/jobs/JobDetailHeader';
import { JobMetaItem } from '@/components/jobs/JobMetaItem';
import { JobPanel } from '@/components/jobs/JobPanel';
import { JobSection } from '@/components/jobs/JobSection';
import { JobTag } from '@/components/jobs/JobTag';

const formatSalary = (min: number, max: number, currency: string) =>
  `${min.toLocaleString('en-US')} - ${max.toLocaleString('en-US')} ${currency}`;

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  const relatedJobs = (await getAllJobs({ sortByCreatedAt: 'desc' }))
    .filter((item) => item.id !== job.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen px-4 py-6 text-[var(--color-ink)] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px] space-y-8">
        <JobDetailHeader job={job} />

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <JobSection title="Beschreibung">{job.description}</JobSection>
            <JobSection title="Aufgaben">
              <ul className="list-disc space-y-2 pl-5">
                {job.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </JobSection>
            <JobSection title="Anforderungen">
              <ul className="list-disc space-y-2 pl-5">
                {job.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </JobSection>
          </div>

          <div className="space-y-6">
            <JobPanel className="space-y-4 p-6">
              <JobMetaItem label="Standort" value={job.location} />
              <JobMetaItem label="Anstellung" value={job.employmentType} />
              <JobMetaItem label="Senioritaet" value={job.seniority} />
              <JobMetaItem label="Remote" value={job.remote ? 'Ja' : 'Nein'} />
              {job.salaryRange ? (
                <JobMetaItem
                  label="Gehalt"
                  value={formatSalary(
                    job.salaryRange.min,
                    job.salaryRange.max,
                    job.salaryRange.currency
                  )}
                />
              ) : null}
            </JobPanel>

            <JobPanel className="p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--color-muted)]">
                Skills
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <JobTag key={skill} label={skill} />
                ))}
              </div>
            </JobPanel>

            <JobPanel className="p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--color-muted)]">
                Keywords
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.keywords.map((keyword) => (
                  <JobTag key={keyword} label={keyword} tone="outline" />
                ))}
              </div>
            </JobPanel>

            {job.benefits && job.benefits.length ? (
              <JobPanel className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--color-muted)]">
                  Benefits
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
                  {job.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </JobPanel>
            ) : null}
          </div>
        </div>

        <JobPanel className="p-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-muted)]">
              Aehnliche Rollen
            </span>
            <span className="h-px flex-1 bg-[var(--color-line)]" />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {relatedJobs.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[var(--color-line)] bg-white/70 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  {item.company}
                </p>
                <p className="mt-2 font-serif text-lg text-[var(--color-ink)]">
                  {item.title}
                </p>
                <p className="mt-2 text-xs text-[var(--color-muted)]">
                  {item.location}
                </p>
              </div>
            ))}
          </div>
        </JobPanel>
      </div>
    </main>
  );
}
