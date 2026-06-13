import {
  useInfiniteQuery as useTanStackInfiniteQuery,
  useMutation as useTanStackMutation,
  useQuery as useTanStackQuery,
  type InfiniteData,
  type QueryKey,
  type UseInfiniteQueryOptions,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query'
import type { PaginationParams } from '@/shared/model'
import type { ApiError } from './http'

export type ApiQueryOptions<
  TQueryFnData,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<UseQueryOptions<TQueryFnData, ApiError, TData, TQueryKey>, 'queryKey' | 'queryFn'>

export type ApiMutationOptions<
  TData,
  TVariables = void,
  TOnMutateResult = unknown,
> = Omit<UseMutationOptions<TData, ApiError, TVariables, TOnMutateResult>, 'mutationFn'>

export type ApiInfiniteQueryOptions<
  TPageData,
  TData = InfiniteData<TPageData, number>,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseInfiniteQueryOptions<TPageData, ApiError, TData, TQueryKey, number>,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>

export type LastPageResponse = {
  lastPage: number
}

type WithoutPage<TParams extends PaginationParams> = Omit<TParams, 'page'>

type ApiInfiniteQueryConfig<
  TPageData extends LastPageResponse,
  TParams extends PaginationParams,
  TData,
  TQueryKey extends QueryKey,
> = {
  queryKey: TQueryKey
  queryFn: (params: TParams) => Promise<TPageData>
  params?: WithoutPage<TParams>
  initialPageParam?: number
  options?: ApiInfiniteQueryOptions<TPageData, TData, TQueryKey>
}

export function useApiQuery<
  TQueryFnData,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseQueryOptions<TQueryFnData, ApiError, TData, TQueryKey>) {
  return useTanStackQuery<TQueryFnData, ApiError, TData, TQueryKey>(options)
}

export function useApiMutation<TData = unknown, TVariables = void, TOnMutateResult = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: ApiMutationOptions<TData, TVariables, TOnMutateResult>,
) {
  return useTanStackMutation<TData, ApiError, TVariables, TOnMutateResult>({
    mutationFn,
    ...options,
  })
}

export function useApiInfiniteQuery<
  TPageData extends LastPageResponse,
  TParams extends PaginationParams = PaginationParams,
  TData = InfiniteData<TPageData, number>,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryKey,
  queryFn,
  params,
  initialPageParam = 1,
  options,
}: ApiInfiniteQueryConfig<TPageData, TParams, TData, TQueryKey>) {
  return useTanStackInfiniteQuery<TPageData, ApiError, TData, TQueryKey, number>({
    queryKey,
    initialPageParam,
    queryFn: ({ pageParam }) => queryFn({ ...params, page: pageParam } as TParams),
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam < lastPage.lastPage ? lastPageParam + 1 : undefined,
    ...options,
  })
}
