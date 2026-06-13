export const bookmarkQueryKeys = {
  all: () => ['bookmark'] as const,
  my: () => [...bookmarkQueryKeys.all(), 'my'] as const,
}

export const bookmarkMutationKeys = {
  add: () => ['bookmark', 'add'] as const,
  remove: () => ['bookmark', 'remove'] as const,
}
