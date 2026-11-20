import React from 'react';
import type { DoodleKind } from './doodleMap';
import { DOODLE_ICONS } from './doodleIcons';

export type DoodleStyle = 'professional' | 'cartoon' | 'doodle';

export interface DoodleProps {
  kind: DoodleKind;
  style?: DoodleStyle;
  className?: string;
}

/**
 * Renders a task icon as an inline SVG (Lucide). The `style` prop is kept for
 * call-site compatibility; all styles now use the same icon set.
 */
export const Doodle: React.FC<DoodleProps> = ({ kind, className = '' }) => {
  const Icon = DOODLE_ICONS[kind];
  if (!Icon) return null;

  return (
    <span
      aria-hidden="true"
      className={`flex h-full w-full items-center justify-center rounded-md bg-[var(--accent-soft)] p-[16%] text-[var(--accent)] ${className}`}
    >
      <Icon className="h-full w-full" strokeWidth={1.75} />
    </span>
  );
};
