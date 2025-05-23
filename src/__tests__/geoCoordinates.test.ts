import { describe, expect, it } from 'vitest';
import { getFormattedUTMCoordinates } from '@/services/geoCoordinatesService';

describe('getFormattedUTMCoordinates', () => {
  it('returns empty string for invalid coords', () => {
    expect(getFormattedUTMCoordinates(NaN, NaN)).toBe('');
  });

  it('converts valid coordinates to formatted UTM string', () => {
    const result = getFormattedUTMCoordinates(40.4168, -3.7038); // Madrid
    expect(result).toMatch(/^UTM 30N E: \d+ N: \d+$/);
  });
});
