export interface CommunityUserInfo {
  _id: string;
  nickname: string;
  profileImageUrl: string | null;
}

export interface CommunityBoardSummary {
  _id: string;
  userId: CommunityUserInfo | null;
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

export interface CommunityBoardListResponse {
  lastPage: number;
  boards: CommunityBoardSummary[];
}

export interface CommunityBoardDetail extends CommunityBoardSummary {
  likeUserIds: string[];
}

export interface CommunityCommentNode {
  _id: string;
  userId: CommunityUserInfo | null;
  body: string;
  likeCount: number;
  likeUserIds: string[];
  parentCommentId: string | null;
  depth: number;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  replies: CommunityCommentNode[];
}

export interface GetCommunityBoardListParams {
  page?: number;
  limit?: number;
  category?: string;
}

export interface CreateCommunityBoardPayload {
  category: string;
  title: string;
  body: string;
  images?: File[];
}

export interface UpdateCommunityBoardPayload extends CreateCommunityBoardPayload {
  boardId: string;
  imageUrls?: string[];
}

export interface CreateCommunityCommentPayload {
  boardId: string;
  body: string;
  parentCommentId?: string;
}

export interface UpdateCommunityCommentPayload {
  boardId: string;
  commentId: string;
  body: string;
}
