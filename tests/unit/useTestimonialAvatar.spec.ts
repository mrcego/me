import { describe, expect, it } from 'vitest';
import { useTestimonialAvatar } from '../../app/composables/ui/useTestimonialAvatar';

describe('useTestimonialAvatar', () => {
  const { getLocalAvatar, getInitials } = useTestimonialAvatar();

  it('maps known names to curated avatar slugs', () => {
    expect(getLocalAvatar('Carol Valdebenito')).toBe('/img/avatars/carol-valdebenito.webp');
    expect(getLocalAvatar('María de los Ángeles Rodríguez')).toBe(
      '/img/avatars/maria-rodriguez.webp',
    );
  });

  it('falls back to a normalized slug for unknown names (bad path)', () => {
    expect(getLocalAvatar('José  Pérez!!')).toBe('/img/avatars/jose-perez.webp');
    expect(getLocalAvatar('---Weird---Name---')).toBe('/img/avatars/weird-name.webp');
  });

  it('builds initials from the first two words', () => {
    expect(getInitials('César Gómez')).toBe('CG');
    expect(getInitials('Madonna')).toBe('M');
  });

  it('handles empty / whitespace names without throwing', () => {
    expect(getInitials('')).toBe('');
    expect(getInitials('   ')).toBe('');
    expect(getLocalAvatar('')).toBe('/img/avatars/.webp');
  });
});
