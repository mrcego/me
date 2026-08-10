const AVATAR_SLUGS: Record<string, string> = {
  'Carol Valdebenito': 'carol-valdebenito',
  'Michell Jose Gutierrez Rincon': 'michell-gutierrez',
  'Fernando Delgado': 'fernando-delgado',
  'Genito Javier Andrade Perez': 'genito-andrade',
  'Andres Felipe Ordoñez Zuluaga': 'andres-ordonez',
  'María de los Ángeles Rodríguez': 'maria-rodriguez',
};

export const useTestimonialAvatar = () => {
  const toSlug = (name: string) =>
    AVATAR_SLUGS[name] ??
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const getLocalAvatar = (name: string) => `/img/avatars/${toSlug(name)}.webp`;

  const getInitials = (name: string) =>
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');

  return { getLocalAvatar, getInitials };
};
