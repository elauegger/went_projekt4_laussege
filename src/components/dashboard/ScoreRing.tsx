type ScoreRingProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export const ScoreRing = ({
  value,
  size = 120,
  strokeWidth = 10,
  className,
}: ScoreRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;

  return (
    <div className={`relative ${className ?? ''}`} style={{ width: size, height: size }}>
      <svg className="h-full w-full" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-track)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-olive)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="font-display text-3xl">{value}</div>
        <div className="text-xs text-[var(--color-muted)]">Gesamt-Score</div>
      </div>
    </div>
  );
};
