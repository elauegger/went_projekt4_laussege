import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

const baseClassName =
  'rounded-[32px] border border-[var(--color-line)] bg-[var(--color-surface)] shadow-[0_18px_45px_rgba(45,38,28,0.08)]';

export const Card = ({ children, className }: CardProps) => (
  <section className={`${baseClassName} ${className ?? ''}`}>{children}</section>
);
