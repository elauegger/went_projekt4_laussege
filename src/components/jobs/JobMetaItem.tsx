type JobMetaItemProps = {
  label: string;
  value: string;
};

export const JobMetaItem = ({ label, value }: JobMetaItemProps) => (
  <div className="flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-white/70 px-4 py-3">
    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
      {label}
    </span>
    <span className="text-sm font-semibold text-[var(--color-ink)]">{value}</span>
  </div>
);
