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

// Alex yol

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
    <main className="min-h-screen px-4 py-6 text-[var(--color-ink)] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px] space-y-8">
        <JobPanel className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-muted)]">
            Jobsy Karriereboard
          </p>
          <h1 className="mt-4 font-serif text-4xl text-[var(--color-ink)] sm:text-5xl">
            Jobs fuer deinen naechsten Schritt
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-muted)] sm:text-base">
            Entdecke aktuelle Rollen und finde Positionen, die zu deinen Skills
            und deiner Senioritaet passen.
          </p>
          <p className="mt-6 text-xs text-[var(--color-muted)]">
            {totalCount} offene Positionen
          </p>
        </JobPanel>

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
          <JobGroupList jobs={pageJobs} />
        ) : (
          <JobPanel className="p-8 text-center text-sm text-[var(--color-muted)]">
            Keine Jobs gefunden. Passe die Filter an oder leere die Suche.
          </JobPanel>
        )}

        <JobPagination
          currentPage={safePage}
          totalPages={totalPages}
          basePath="/jobs"
          query={paginationQuery}
        />
      </div>
    </main>
  );
}
