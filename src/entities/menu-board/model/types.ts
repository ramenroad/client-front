export interface MenuBoard {
  _id: string;
  userId: {
    _id: string;
    nickname: string;
    profileImageUrl: string;
  };
  imageUrl: string;
  description: string;
  isApproved: boolean;
  createdAt: string;
}
