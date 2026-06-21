import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getAllJobs } from '../../../lib/jobs';
import { auth } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { JobTag } from '../../../components/jobs/JobTag';
import { JobPanel } from '../../../components/jobs/JobPanel';
import { FavoriteJobButton } from '../../../components/jobs/FavoriteJobButton';

type JobDetailPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

const formatDate = (value: string) => value.split('T')[0] ?? value;

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const jobs = await getAllJobs({});
  const job = jobs.find((item) => item.id === id);

  if (!job) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  const favorite = userId
    ? await prisma.saved_jobs.findUnique({
        where: {
          userId_jobId: {
            userId,
            jobId: job.id,
          },
        },
        select: { id: true },
      })
    : null;

  return (
    <main className="min-h-screen px-4 py-6 text-[#2f3628] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <JobPanel className="p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.42em] text-[var(--color-muted)]">
                {job.company}
              </p>

              <h1 className="mt-3 font-serif text-4xl text-[var(--color-ink)]">
                {job.title}
              </h1>

              <p className="mt-3 text-sm text-[var(--color-muted)]">
                {job.location} • Erstellt am {formatDate(job.createdAt)}
              </p>
            </div>

            <FavoriteJobButton
              jobId={job.id}
              initialFavorite={Boolean(favorite)}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <JobTag label={job.employmentType} />
            <JobTag label={job.seniority} tone="outline" />
            {job.remote ? <JobTag label="Remote" tone="accent" /> : null}
          </div>
        </JobPanel>

        <JobPanel className="p-8">
          <h2 className="font-serif text-2xl text-[var(--color-ink)]">
            Beschreibung
          </h2>

          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--color-muted)]">
            {job.description}
          </p>
        </JobPanel>

        <JobPanel className="p-8">
          <h2 className="font-serif text-2xl text-[var(--color-ink)]">
            Skills
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <JobTag key={skill} label={skill} tone="outline" />
            ))}
          </div>
        </JobPanel>

        <div className="flex flex-wrap justify-between gap-3">
          <Link
            href="/jobs"
            className="rounded-full border border-[var(--color-line)] bg-white px-5 py-2 text-xs font-semibold text-[var(--color-olive-strong)]"
          >
            Zurück zu Jobs
          </Link>

          <Link
            href="/jobs/favorites"
            className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface-strong)] px-5 py-2 text-xs font-semibold text-[var(--color-olive-strong)]"
          >
            Meine Favoriten
          </Link>
        </div>
      </div>
    </main>
  );
}