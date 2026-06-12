import { NoticeListView } from '@/entities/support/ui'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import TopBar from '@/shared/ui/top-bar'
import { useNoticePage } from '../model/useNoticePage'

const NoticePage = () => {
  const { visibleNotices, isLoading, isError, hasMore, onItemClick, onLoadMore } = useNoticePage()

  return (
    <Layout variant="standalone">
      <TopBar title="공지사항" />
      <Content>
        <NoticeListView
          notices={visibleNotices}
          isLoading={isLoading}
          isError={isError}
          hasMore={hasMore}
          emptyText="등록된 공지사항이 없어요."
          onItemClick={onItemClick}
          onLoadMore={onLoadMore}
        />
      </Content>
    </Layout>
  )
}

const Layout = render.extend(PageLayout)

const Content = render.section('flex w-full flex-1 flex-col px-20')

export default NoticePage
