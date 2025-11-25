import { User } from "../review";

export interface Article {
  _id: string;
  userId: User;
  category: string;
  title: string;
  body: string;
  commentCount: number;
  likeCount: number;
  viewCount: number;
  ImageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticleDetail {
  _id: string;
  userId: User;
  category: string;
  title: string;
  body: string;
  likeCount: number;
  likeUserIds: string[];
  viewCount: number;
  commentCount: number;
  ImageUrls: string[];
  createdAt: string;
  updatedAt: string;
}
