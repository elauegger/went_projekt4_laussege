type JobMetaItemProps = {
  label: string;
  value: string;
};

export const JobMetaItem = ({ label, value }: JobMetaItemProps) => (
  <div className="flex items-start justify-between gap-4 text-sm">
    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
      {label}
    </span>
    <span className="text-right text-[var(--color-ink)]">{value}</span>
  </div>
);
