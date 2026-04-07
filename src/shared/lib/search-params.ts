export const updateSearchParams = (
  params: URLSearchParams,
  updater: (nextParams: URLSearchParams) => void,
) => {
  const nextParams = new URLSearchParams(params);
  updater(nextParams);
  return nextParams;
};
