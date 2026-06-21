import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAllJobs } from '../../../lib/jobs';
import { auth } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { JobGroupList } from '../../../components/jobs/JobGroupList';

export default async function FavoriteJobsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  if (!userId) {
    redirect('/login');
  }

  const favorites = await prisma.saved_jobs.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { jobId: true },
  });

  const favoriteJobIds = favorites.map((favorite) => favorite.jobId);

  const jobs = await getAllJobs({});
  const favoriteJobs = jobs.filter((job) => favoriteJobIds.includes(job.id));

  return (
    <main className="min-h-screen px-4 py-6 text-[#2f3628] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[36px] border border-[#d9ceb1] bg-[#f6f0e6] p-8 shadow-[0_24px_90px_rgba(98,87,55,0.14)]">
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#8d8667]">
            Jobsy Favoriten
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-serif text-4xl text-[#4d5240]">
              Gespeicherte Jobs
            </h1>

            <Link
              href="/jobs"
              className="rounded-full border border-[#d6caa9] bg-[#f9f4e7] px-4 py-2 text-xs font-semibold text-[#6e7456] transition hover:bg-[#f3ecd9]"
            >
              Zurück zu Jobs
            </Link>
          </div>

          <p className="mt-3 text-sm text-[#6f6a58]">
            Hier findest du alle Jobs, die du als Favorit gespeichert hast.
          </p>
        </div>

        {favoriteJobs.length ? (
          <JobGroupList jobs={favoriteJobs} favoriteJobIds={favoriteJobIds} />
        ) : (
          <div className="rounded-[28px] border border-[#e5dcc1] bg-white/75 p-8 text-center shadow-[0_14px_40px_rgba(116,101,65,0.07)] backdrop-blur">
            <p className="text-sm text-[#6f6a58]">
              Du hast noch keine Jobs gespeichert.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}