import dayjs from "dayjs";
import type { CommunityBoardSummary } from "../model";

export const getRelativeTimeLabel = (dateString?: string) => {
  if (!dateString) {
    return "";
  }

  const targetDate = dayjs(dateString);

  if (!targetDate.isValid()) {
    return "";
  }

  const now = dayjs();
  const minutes = now.diff(targetDate, "minute");

  if (minutes < 1) {
    return "방금 전";
  }

  if (minutes < 60) {
    return `${minutes}분 전`;
  }

  const hours = now.diff(targetDate, "hour");

  if (hours < 24) {
    return `${hours}시간 전`;
  }

  const days = now.diff(targetDate, "day");

  if (days < 7) {
    return `${days}일 전`;
  }

  return targetDate.format("YYYY.MM.DD");
};

export const getCommunityBoardPopularityScore = (
  board: Pick<CommunityBoardSummary, "viewCount" | "likeCount" | "commentCount" | "createdAt">,
) => {
  const freshness = Math.max(1, 30 - dayjs().diff(dayjs(board.createdAt), "day"));

  return board.commentCount * 12 + board.likeCount * 8 + board.viewCount + freshness;
};
