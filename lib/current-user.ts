export const DEMO_USER_ID = 'demo-user';

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
}

const DEMO_USER: CurrentUser = {
  id: DEMO_USER_ID,
  fullName: 'Pengguna Demo',
  email: 'demo@rebites.id',
};

export function getCurrentUser(): CurrentUser {
  return DEMO_USER;
}

export function getCurrentUserId(): string {
  return getCurrentUser().id;
}
