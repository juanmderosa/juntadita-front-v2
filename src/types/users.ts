export type UserSummary = {
  id: string;
  email: string | null;
};

export type Profile = {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  onboardingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CurrentUser = {
  user: UserSummary;
  profile: Profile;
  requiresProfileOnboarding: boolean;
};
