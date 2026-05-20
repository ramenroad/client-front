export const profileMutationKeys = {
  updateNickname: () => ['profile', 'nickname', 'update'] as const,
  updateProfileImage: () => ['profile', 'image', 'update'] as const,
  updateIsPublic: () => ['profile', 'is-public', 'update'] as const,
}
