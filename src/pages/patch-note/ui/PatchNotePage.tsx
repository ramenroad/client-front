import { NoticeListView } from '@/entities/support/ui'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import TopBar from '@/shared/ui/top-bar'
import { usePatchNotePage } from '../model/usePatchNotePage'

const PatchNotePage = () => {
  const { visibleNotices, isLoading, isError, hasMore, onItemClick, onLoadMore } = usePatchNotePage()

  return (
    <Layout variant="standalone">
      <TopBar title="패치노트" />
      <Content>
        <NoticeListView
          notices={visibleNotices}
          isLoading={isLoading}
          isError={isError}
          hasMore={hasMore}
          emptyText="등록된 패치노트가 없어요."
          onItemClick={onItemClick}
          onLoadMore={onLoadMore}
        />
      </Content>
    </Layout>
  )
}

const Layout = render.extend(PageLayout)

const Content = render.section('flex w-full flex-1 flex-col px-20')

export default PatchNotePage
