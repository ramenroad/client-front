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

export interface CommentUser {
  _id: string;
  nickname: string;
  profileImageUrl: string;
}

export interface Comment {
  _id: string;
  userId: CommentUser;
  body: string;
  likeCount: number;
  likeUserIds: string[];
  parentCommentId: string | null;
  depth: number;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  replies: Comment[];
}
