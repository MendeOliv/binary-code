import { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeaderProps) {
  const isCenter = align === 'center';
  return (
    <div
      className={`flex flex-col gap-4 max-w-3xl ${
        isCenter ? 'items-center text-center mx-auto' : 'items-start'
      }`}
    >
      <div className="flex items-center gap-2 tech-label">
        <span className="state-dot" aria-hidden="true" />
        {eyebrow}
      </div>
      <h2 className="font-mono text-headline-lg md:text-headline-xl uppercase text-on-surface tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="font-mono text-body-md text-on-surface-variant leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}