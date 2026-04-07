import { instanceWithNoVersioning } from "@/shared/api/http";
import type {
  CommunityBoardDetail,
  CommunityBoardListResponse,
  CommunityCommentNode,
  CreateCommunityBoardPayload,
  CreateCommunityCommentPayload,
  GetCommunityBoardListParams,
  UpdateCommunityBoardPayload,
  UpdateCommunityCommentPayload,
} from "../model/types";

const appendBoardFiles = (formData: FormData, images?: File[]) => {
  images?.forEach((image) => {
    formData.append("Images", image);
  });
};

const createBoardFormData = ({
  category,
  title,
  body,
  images,
  imageUrls,
}: {
  category: string;
  title: string;
  body: string;
  images?: File[];
  imageUrls?: string[];
}) => {
  const formData = new FormData();

  formData.append("category", category);
  formData.append("title", title);
  formData.append("body", body);

  if (imageUrls !== undefined) {
    formData.append("ImageUrls", imageUrls.join(","));
  }

  appendBoardFiles(formData, images);

  return formData;
};

export const createCommunityBoard = async ({ category, title, body, images }: CreateCommunityBoardPayload) => {
  const response = await instanceWithNoVersioning.post(
    "/community/board",
    createBoardFormData({ category, title, body, images }),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const getCommunityBoards = async ({ page, limit, category }: GetCommunityBoardListParams = {}) => {
  const response = await instanceWithNoVersioning.get<CommunityBoardListResponse>("/community/boards", {
    params: { page, limit, category },
  });

  return response.data;
};

export const getCommunityBoardDetail = async (boardId: string) => {
  const response = await instanceWithNoVersioning.get<CommunityBoardDetail>(`/community/board/${boardId}`);

  return response.data;
};

export const updateCommunityBoard = async ({
  boardId,
  category,
  title,
  body,
  imageUrls,
  images,
}: UpdateCommunityBoardPayload) => {
  const response = await instanceWithNoVersioning.patch(
    `/community/board/${boardId}`,
    createBoardFormData({ category, title, body, imageUrls, images }),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const deleteCommunityBoard = async (boardId: string) => {
  const response = await instanceWithNoVersioning.delete(`/community/board/${boardId}`);

  return response.data;
};

export const addCommunityBoardLike = async (boardId: string) => {
  const response = await instanceWithNoVersioning.post(`/community/board/${boardId}/like`);

  return response.data;
};

export const deleteCommunityBoardLike = async (boardId: string) => {
  const response = await instanceWithNoVersioning.delete(`/community/board/${boardId}/like`);

  return response.data;
};

export const createCommunityComment = async ({ boardId, ...payload }: CreateCommunityCommentPayload) => {
  const response = await instanceWithNoVersioning.post(`/community/board/${boardId}/comment`, payload);

  return response.data;
};

export const getCommunityComments = async (boardId: string) => {
  const response = await instanceWithNoVersioning.get<CommunityCommentNode[]>(`/community/board/${boardId}/comment`);

  return response.data;
};

export const updateCommunityComment = async ({ boardId, commentId, body }: UpdateCommunityCommentPayload) => {
  const response = await instanceWithNoVersioning.patch(`/community/board/${boardId}/comment/${commentId}`, { body });

  return response.data;
};

export const deleteCommunityComment = async ({ boardId, commentId }: { boardId: string; commentId: string }) => {
  const response = await instanceWithNoVersioning.delete(`/community/board/${boardId}/comment/${commentId}`);

  return response.data;
};

export const addCommunityCommentLike = async ({ boardId, commentId }: { boardId: string; commentId: string }) => {
  const response = await instanceWithNoVersioning.post(`/community/board/${boardId}/comment/${commentId}/like`);

  return response.data;
};

export const deleteCommunityCommentLike = async ({ boardId, commentId }: { boardId: string; commentId: string }) => {
  const response = await instanceWithNoVersioning.delete(`/community/board/${boardId}/comment/${commentId}/like`);

  return response.data;
};
