type JobPaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query: Record<string, string | undefined>;
};

const buildHref = (
  basePath: string,
  query: Record<string, string | undefined>,
  page: number
) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  if (page > 1) {
    params.set('page', String(page));
  }

  const queryString = params.toString();

  return queryString ? `${basePath}?${queryString}` : basePath;
};

const buildPages = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);

  for (let offset = -1; offset <= 1; offset += 1) {
    const page = currentPage + offset;
    if (page > 1 && page < totalPages) {
      pages.add(page);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
};

export const JobPagination = ({
  currentPage,
  totalPages,
  basePath,
  query,
}: JobPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPages(currentPage, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[var(--color-line)] bg-[var(--color-surface)] px-6 py-4 text-sm">
      <span className="text-xs text-[var(--color-muted)]">
        Seite {currentPage} von {totalPages}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={buildHref(basePath, query, Math.max(1, currentPage - 1))}
          className={`rounded-full border border-[var(--color-line)] px-4 py-2 text-xs font-semibold ${
            currentPage === 1
              ? 'pointer-events-none text-[var(--color-muted)]'
              : 'bg-white text-[var(--color-olive-strong)]'
          }`}
        >
          Zurueck
        </a>
        {pages.map((page, index) => {
          const prev = pages[index - 1];
          const showGap = prev && page - prev > 1;

          return (
            <span key={`page-${page}`} className="flex items-center gap-2">
              {showGap ? (
                <span className="px-1 text-xs text-[var(--color-muted)]">...</span>
              ) : null}
              <a
                href={buildHref(basePath, query, page)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
                  page === currentPage
                    ? 'bg-[var(--color-olive)] text-white'
                    : 'border border-[var(--color-line)] bg-white text-[var(--color-olive-strong)]'
                }`}
              >
                {page}
              </a>
            </span>
          );
        })}
        <a
          href={buildHref(basePath, query, Math.min(totalPages, currentPage + 1))}
          className={`rounded-full border border-[var(--color-line)] px-4 py-2 text-xs font-semibold ${
            currentPage === totalPages
              ? 'pointer-events-none text-[var(--color-muted)]'
              : 'bg-white text-[var(--color-olive-strong)]'
          }`}
        >
          Weiter
        </a>
      </div>
    </div>
  );
};
