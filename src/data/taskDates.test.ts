import { describe, expect, it } from 'vitest';
import { formatTimeLabel } from './taskDates';

describe('formatTimeLabel', () => {
  it('shows 24-hour values in a 12-hour label', () => {
    expect(formatTimeLabel('20:30')).toBe('8:30 PM');
    expect(formatTimeLabel('08:05')).toBe('8:05 AM');
    expect(formatTimeLabel('00:15')).toBe('12:15 AM');
    expect(formatTimeLabel('12:00')).toBe('12:00 PM');
  });

  it('returns empty for missing values and passes odd values through', () => {
    expect(formatTimeLabel('')).toBe('');
    expect(formatTimeLabel(undefined)).toBe('');
    expect(formatTimeLabel('later')).toBe('later');
  });
});
