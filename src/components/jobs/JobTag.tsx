type JobTagProps = {
  label: string;
  tone?: 'soft' | 'accent' | 'outline';
};

const toneStyles = {
  soft: 'bg-[var(--color-surface-strong)] text-[var(--color-olive-strong)]',
  accent: 'bg-[var(--color-olive)] text-white',
  outline: 'border border-[var(--color-line)] text-[var(--color-muted)]',
};

export const JobTag = ({ label, tone = 'soft' }: JobTagProps) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
      toneStyles[tone]
    }`}
  >
    {label}
  </span>
);
