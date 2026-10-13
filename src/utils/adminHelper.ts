export interface AdminInfo {
  initial: string;
  name: string;
  username: string;
}

export const ADMIN_DIRECTORY: Record<string, AdminInfo> = {
  janardhan: { initial: 'J', name: 'Janardhan', username: 'janardhan' },
  'krishna.n': { initial: 'K', name: 'Krishna', username: 'krishna.n' },
  'eswar.m': { initial: 'E', name: 'Eswar', username: 'eswar.m' },
  'raju.d': { initial: 'R', name: 'Raju', username: 'raju.d' },
};

export const ADMIN_INITIAL_LOOKUP: Record<string, { initial: string; name: string }> = {
  J: { initial: 'J', name: 'Janardhan' },
  K: { initial: 'K', name: 'Krishna' },
  E: { initial: 'E', name: 'Eswar' },
  R: { initial: 'R', name: 'Raju' },
};

export const getAdminInfo = (adminIdentifier?: string): { initial: string; name: string } => {
  if (!adminIdentifier) {
    return { initial: 'A', name: 'Admin' };
  }
  const clean = adminIdentifier.trim().toLowerCase();

  if (ADMIN_DIRECTORY[clean]) {
    return ADMIN_DIRECTORY[clean];
  }

  const upper = adminIdentifier.trim().toUpperCase();
  if (ADMIN_INITIAL_LOOKUP[upper]) {
    return ADMIN_INITIAL_LOOKUP[upper];
  }

  const firstLetter = adminIdentifier.trim().charAt(0).toUpperCase() || 'A';
  if (ADMIN_INITIAL_LOOKUP[firstLetter]) {
    return ADMIN_INITIAL_LOOKUP[firstLetter];
  }

  return {
    initial: firstLetter,
    name: adminIdentifier.charAt(0).toUpperCase() + adminIdentifier.slice(1),
  };
};

export const extractAdminNotation = (text?: string): { initial: string; name: string } | null => {
  if (!text) return null;
  const match = text.match(/\[([A-Za-z])\]/);
  if (match) {
    return getAdminInfo(match[1]);
  }
  return null;
};
