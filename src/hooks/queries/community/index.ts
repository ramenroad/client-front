import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { getArticleDetail, getArticleList } from "../../../api/community";

export interface ArticleQueryParams {
  page: number;
  limit: number;
}

export const useArticleQuery = () => {
  const articleQuery = useInfiniteQuery({
    ...queryKeys.communityArticle.list({ page: 1, limit: 10 }),
    queryFn: ({ pageParam = 1 }) => getArticleList({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => (allPages.length < lastPage.lastPage ? allPages.length + 1 : undefined),
    initialPageParam: 1,
  });

  return { articleQuery };
};

export const useArticleDetailQuery = (id?: string) => {
  const articleDetailQuery = useQuery({
    ...queryKeys.communityArticle.detail(id ?? ""),
    queryFn: () => getArticleDetail(id!),
    enabled: !!id,
  });

  return { articleDetailQuery };
};
