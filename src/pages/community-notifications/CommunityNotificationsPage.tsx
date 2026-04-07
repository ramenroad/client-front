import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconBack } from "@/shared/ui/icon";
import render from "@/shared/ui/render";
import { COMMUNITY_NOTIFICATION_MOCKS, COMMUNITY_NOTIFICATION_READ_STORAGE_KEY } from "@/entities/community/model";

const CommunityNotificationsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(COMMUNITY_NOTIFICATION_READ_STORAGE_KEY, "read");
  }, []);

  return (
    <Page>
      <Header>
        <BackButton type="button" onClick={() => navigate(-1)} aria-label="이전 페이지로 이동">
          <IconBack />
        </BackButton>
        <HeaderTitle>알림</HeaderTitle>
      </Header>

      {COMMUNITY_NOTIFICATION_MOCKS.length === 0 ? (
        <EmptyState>
          <EmptyTitle>받은 알림이 없어요</EmptyTitle>
          <EmptyDescription>새 댓글이나 좋아요가 생기면 여기에 표시됩니다.</EmptyDescription>
        </EmptyState>
      ) : (
        <NotificationList>
          {COMMUNITY_NOTIFICATION_MOCKS.map((notification) => (
            <NotificationCard key={notification.id}>
              <NotificationHeader>
                <NotificationTitleRow>
                  {notification.unread ? <UnreadDot /> : null}
                  <NotificationTitle>{notification.title}</NotificationTitle>
                </NotificationTitleRow>
                <NotificationTime>{notification.timeLabel}</NotificationTime>
              </NotificationHeader>
              <NotificationMessage>{notification.message}</NotificationMessage>
              {notification.excerpt ? <NotificationExcerpt>{notification.excerpt}</NotificationExcerpt> : null}
            </NotificationCard>
          ))}
        </NotificationList>
      )}
    </Page>
  );
};

const Page = render.section("min-h-[100dvh] w-full bg-white");

const Header = render.div("relative flex items-center justify-center px-20 py-10");

const BackButton = render.button(
  "absolute left-20 top-10 flex h-24 w-24 items-center justify-center border-none bg-transparent p-0",
);

const HeaderTitle = render.div("font-16-sb text-black");

const NotificationList = render.div("border-0 border-t border-solid border-border");

const NotificationCard = render.article("border-0 border-b border-solid border-border px-20 py-18");

const NotificationHeader = render.div("flex items-center justify-between gap-12");

const NotificationTitleRow = render.div("flex items-center gap-8");

const UnreadDot = render.div("h-8 w-8 rounded-full bg-orange");

const NotificationTitle = render.div("font-16-sb text-gray-900");

const NotificationTime = render.div("shrink-0 font-12-r text-gray-400");

const NotificationMessage = render.div("mt-10 font-14-r text-gray-800 break-words");

const NotificationExcerpt = render.div("mt-10 rounded-[8px] bg-border px-12 py-10 font-14-r text-gray-500");

const EmptyState = render.div("flex min-h-[calc(100dvh-44px)] flex-col items-center justify-center px-20 text-center");

const EmptyTitle = render.div("font-18-sb text-gray-900");

const EmptyDescription = render.div("mt-8 font-14-r text-gray-500");

export default CommunityNotificationsPage;
