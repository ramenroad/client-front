import { useMutation } from "@tanstack/react-query";
import {
  addCommunityBoardLike,
  addCommunityCommentLike,
  createCommunityBoard,
  createCommunityComment,
  deleteCommunityBoard,
  deleteCommunityBoardLike,
  deleteCommunityComment,
  deleteCommunityCommentLike,
  updateCommunityBoard,
  updateCommunityComment,
} from "@/entities/community/api";
import { queryClient } from "@/shared/api/query-client";
import { queryKeys } from "@/shared/model/query-keys";

const invalidateCommunityListQueries = () => {
  queryClient.invalidateQueries({ queryKey: queryKeys.community.list._def });
};

const invalidateCommunityBoardQueries = (boardId: string) => {
  invalidateCommunityListQueries();
  queryClient.invalidateQueries({ ...queryKeys.community.detail(boardId) });
  queryClient.invalidateQueries({ ...queryKeys.community.comments(boardId) });
  queryClient.invalidateQueries({ ...queryKeys.mypage.myPosts });
};

export const useCommunityBoardMutation = () => {
  const create = useMutation({
    mutationFn: createCommunityBoard,
    onSuccess: () => {
      invalidateCommunityListQueries();
      queryClient.invalidateQueries({ ...queryKeys.mypage.myPosts });
    },
  });

  const update = useMutation({
    mutationFn: updateCommunityBoard,
    onSuccess: (_data, { boardId }) => {
      invalidateCommunityBoardQueries(boardId);
    },
  });

  const remove = useMutation({
    mutationFn: deleteCommunityBoard,
    onSuccess: (_data, boardId) => {
      invalidateCommunityBoardQueries(boardId);
    },
  });

  const addLike = useMutation({
    mutationFn: addCommunityBoardLike,
    onSuccess: (_data, boardId) => {
      invalidateCommunityBoardQueries(boardId);
    },
  });

  const removeLike = useMutation({
    mutationFn: deleteCommunityBoardLike,
    onSuccess: (_data, boardId) => {
      invalidateCommunityBoardQueries(boardId);
    },
  });

  return { create, update, remove, addLike, removeLike };
};

export const useCommunityCommentMutation = () => {
  const create = useMutation({
    mutationFn: createCommunityComment,
    onSuccess: (_data, { boardId }) => {
      invalidateCommunityBoardQueries(boardId);
      queryClient.invalidateQueries({ ...queryKeys.mypage.myComments });
    },
  });

  const update = useMutation({
    mutationFn: updateCommunityComment,
    onSuccess: (_data, { boardId }) => {
      queryClient.invalidateQueries({ ...queryKeys.community.comments(boardId) });
      queryClient.invalidateQueries({ ...queryKeys.mypage.myComments });
    },
  });

  const remove = useMutation({
    mutationFn: deleteCommunityComment,
    onSuccess: (_data, { boardId }) => {
      invalidateCommunityBoardQueries(boardId);
      queryClient.invalidateQueries({ ...queryKeys.mypage.myComments });
    },
  });

  const addLike = useMutation({
    mutationFn: addCommunityCommentLike,
    onSuccess: (_data, { boardId }) => {
      queryClient.invalidateQueries({ ...queryKeys.community.comments(boardId) });
      queryClient.invalidateQueries({ ...queryKeys.mypage.myComments });
    },
  });

  const removeLike = useMutation({
    mutationFn: deleteCommunityCommentLike,
    onSuccess: (_data, { boardId }) => {
      queryClient.invalidateQueries({ ...queryKeys.community.comments(boardId) });
      queryClient.invalidateQueries({ ...queryKeys.mypage.myComments });
    },
  });

  return { create, update, remove, addLike, removeLike };
};
