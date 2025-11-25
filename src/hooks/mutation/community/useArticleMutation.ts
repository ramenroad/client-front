import { useMutation } from "@tanstack/react-query";
import { postArticle } from "../../../api/community";
import { CommunityArticleType } from "../../../pages/community-submit-page";

export interface ArticleForm {
  title: string;
  body: string;
  images: File[];
  category: CommunityArticleType;
}

export const useArticleMutation = () => {
  const postArticleMutation = useMutation({
    mutationFn: async (data: ArticleForm): Promise<unknown> => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("body", data.body);
      formData.append("category", data.category);
      data.images.forEach((image) => {
        formData.append("images", image);
      });
      return postArticle(formData);
    },
  });

  return { postArticleMutation };
};
