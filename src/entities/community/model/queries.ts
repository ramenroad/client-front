import { useQuery } from "@tanstack/react-query";
import { useSignInStore } from "@/entities/viewer/model";
import { queryKeys } from "@/shared/model/query-keys";
import { getCommunityBoardDetail, getCommunityBoards, getCommunityComments } from "../api";
import type { GetCommunityBoardListParams } from "./types";

export const useCommunityBoardListQuery = (params: GetCommunityBoardListParams = {}) => {
  const communityBoardListQuery = useQuery({
    ...queryKeys.community.list(params),
    queryFn: () => getCommunityBoards(params),
  });

  return { communityBoardListQuery };
};

export const useCommunityBoardDetailQuery = (boardId?: string) => {
  const communityBoardDetailQuery = useQuery({
    ...queryKeys.community.detail(boardId ?? ""),
    queryFn: () => getCommunityBoardDetail(boardId!),
    enabled: !!boardId,
  });

  return { communityBoardDetailQuery };
};

export const useCommunityCommentsQuery = (boardId?: string, enabled: boolean = true) => {
  const { accessToken } = useSignInStore();

  const communityCommentsQuery = useQuery({
    ...queryKeys.community.comments(boardId ?? ""),
    queryFn: () => getCommunityComments(boardId!),
    enabled: !!accessToken && !!boardId && enabled,
  });

  return { communityCommentsQuery };
};
