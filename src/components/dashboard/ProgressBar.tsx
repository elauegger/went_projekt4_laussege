type ProgressBarProps = {
  value: number;
  tone?: 'olive' | 'gold' | 'sand';
};

const toneClasses = {
  olive: 'bg-[var(--color-olive)]',
  gold: 'bg-[var(--color-gold)]',
  sand: 'bg-[#c5b8a6]',
};

export const ProgressBar = ({ value, tone = 'olive' }: ProgressBarProps) => (
  <div className="mt-3 h-2 rounded-full bg-[var(--color-track)]">
    <div
      className={`h-2 rounded-full ${toneClasses[tone]}`}
      style={{ width: `${value}%` }}
    />
  </div>
);
