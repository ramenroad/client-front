import { type MutationFunction, type MutationOptions } from "@tanstack/react-query";
import { queryClient } from "@/shared/api/query-client";

type ExecuteMutationOptions<TData, TError, TVariables, TContext> = Omit<
  MutationOptions<TData, TError, TVariables, TContext>,
  "mutationFn"
>;

export const executeMutation = <TData, TVariables, TError = Error, TContext = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
  variables: TVariables,
  options?: ExecuteMutationOptions<TData, TError, TVariables, TContext>,
) => {
  return queryClient
    .getMutationCache()
    .build(queryClient, {
      ...options,
      mutationFn,
    })
    .execute(variables);
};
