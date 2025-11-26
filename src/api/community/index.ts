import { instanceWithNoVersioning } from "..";
import { Article, ArticleDetail } from "../../types/community";
import { Comment } from "../../types/community";

export interface ArticleListResponse {
  lastPage: number;
  boards: Article[];
}

export const getArticleList = async ({ page, limit }: { page: number; limit: number }) => {
  const response = await instanceWithNoVersioning.get<ArticleListResponse>("/community/boards", {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

export const getArticleDetail = async (id: string) => {
  const response = await instanceWithNoVersioning.get<ArticleDetail>(`/community/board/${id}`);
  return response.data;
};

export const postArticle = async (data: FormData) => {
  const response = await instanceWithNoVersioning.post("/community/board", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getArticleCommentList = async (id: string) => {
  const response = await instanceWithNoVersioning.get<Comment[]>(`/community/board/${id}/comment`);
  return response.data;
};
