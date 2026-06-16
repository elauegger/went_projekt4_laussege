import Link from 'next/link';
import { getAllJobs } from '../../lib/jobs';
import type { Job } from '../../types/job';
import { JobFilters } from '../../components/jobs/JobFilters';
import { JobGroupList } from '../../components/jobs/JobGroupList';
import { JobPagination } from '../../components/jobs/JobPagination';
import { JobPanel } from '../../components/jobs/JobPanel';

type SearchParams = Record<string, string | string[] | undefined>;

const getParam = (params: SearchParams | undefined, key: string) => {
  const value = params?.[key];
  return Array.isArray(value) ? value[0] : value;
};

const parseBoolean = (value?: string) => {
  if (!value) {
    return undefined;
  }

  if (value.toLowerCase() === 'true') {
    return true;
  }

  if (value.toLowerCase() === 'false') {
    return false;
  }

  return undefined;
};

const parseSeniority = (value?: string): Job['seniority'] | undefined => {
  if (!value) {
    return undefined;
  }

  const options: Job['seniority'][] = ['Junior', 'Mid-Level', 'Senior', 'Lead'];

  return options.includes(value as Job['seniority'])
    ? (value as Job['seniority'])
    : undefined;
};

const parseEmployment = (value?: string): Job['employmentType'] | undefined => {
  if (!value) {
    return undefined;
  }

  const options: Job['employmentType'][] = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Remote',
  ];

  return options.includes(value as Job['employmentType'])
    ? (value as Job['employmentType'])
    : undefined;
};

const parseSort = (value?: string): 'asc' | 'desc' | undefined => {
  if (value === 'asc' || value === 'desc') {
    return value;
  }

  return undefined;
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = getParam(params, 'q');
  const skill = getParam(params, 'skill');
  const company = getParam(params, 'company');
  const location = getParam(params, 'location');
  const employmentType = parseEmployment(getParam(params, 'employmentType'));
  const seniority = parseSeniority(getParam(params, 'seniority'));
  const remoteValue = getParam(params, 'remote');
  const sortValue = getParam(params, 'sort');
  const pageValue = getParam(params, 'page');
  const currentPage = Math.max(1, Number.parseInt(pageValue ?? '1', 10) || 1);
  const pageSize = 12;

  const jobs = await getAllJobs({
    query: q,
    skill,
    company,
    location,
    employmentType,
    seniority,
    remote: parseBoolean(remoteValue),
    sortByCreatedAt: parseSort(sortValue),
  });

  const totalCount = jobs.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pageJobs = jobs.slice(startIndex, startIndex + pageSize);
  const paginationQuery = {
    q,
    skill,
    company,
    location,
    employmentType: employmentType ?? undefined,
    seniority: seniority ?? undefined,
    remote: remoteValue ?? undefined,
    sort: sortValue ?? undefined,
  };

  return (
    <main className="min-h-screen px-4 py-6 text-[#2f3628] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* HEADER */}
        <div className="rounded-[36px] border border-[#d9ceb1] bg-[#f6f0e6] p-8 shadow-[0_24px_90px_rgba(98,87,55,0.14)]">
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#8d8667]">
            Jobsy Karriereboard
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-serif text-4xl text-[#4d5240]">
              Jobs für deinen nächsten Schritt
            </h1>
            <Link
              href="/"
              className="rounded-full border border-[#d6caa9] bg-[#f9f4e7] px-4 py-2 text-xs font-semibold text-[#6e7456] transition hover:bg-[#f3ecd9]"
            >
              Zurück zu Home
            </Link>
          </div>
          <p className="mt-3 text-sm text-[#6f6a58]">
            Entdecke aktuelle Rollen und finde Positionen, die zu deinen Skills und deiner Seniörität passen.
          </p>
        </div>

        {/* FILTERS & CONTENT */}
        <div className="space-y-6">
          <JobFilters
            values={{
              q,
              skill,
              company,
              location,
              employmentType: employmentType ?? '',
              seniority: seniority ?? '',
              remote: remoteValue ?? '',
              sort: sortValue ?? '',
            }}
          />

          {pageJobs.length ? (
            <div className="space-y-1 text-sm text-[#8a8467]">
              <p className="font-medium">{totalCount} Positionen insgesamt • Seite {safePage} von {totalPages}</p>
            </div>
          ) : null}

          {pageJobs.length ? (
            <JobGroupList jobs={pageJobs} />
          ) : (
            <div className="rounded-[28px] border border-[#e5dcc1] bg-white/75 p-8 text-center shadow-[0_14px_40px_rgba(116,101,65,0.07)] backdrop-blur">
              <p className="text-sm text-[#6f6a58]">
                Keine Jobs gefunden. Passe die Filter an oder leere die Suche.
              </p>
            </div>
          )}

          <JobPagination
            currentPage={safePage}
            totalPages={totalPages}
            basePath="/jobs"
            query={paginationQuery}
          />
        </div>
      </div>
    </main>
  );
}
