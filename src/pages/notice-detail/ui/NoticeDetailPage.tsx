import { isNewNotice } from '@/entities/support/lib'
import { NewBadge } from '@/entities/support/ui'
import { formatFullDate } from '@/shared/lib/date'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import TopBar from '@/shared/ui/top-bar'
import { useNoticeDetailPage } from '../model/useNoticeDetailPage'

const NoticeDetailPage = () => {
  const { title, notice, isLoading, isError } = useNoticeDetailPage()

  return (
    <Layout variant="standalone">
      <TopBar title={title} />

      {isLoading && <StateText>불러오는 중...</StateText>}

      {isError && <StateText>내용을 불러오지 못했어요.</StateText>}

      {!isLoading && !isError && !notice && <StateText>내용을 찾을 수 없어요.</StateText>}

      {!isLoading && !isError && notice && (
        <Article>
          <Header>
            <Title>{notice.title}</Title>
            <Meta>
              <DateText>{formatFullDate(notice.createdAt)}</DateText>
              {isNewNotice(notice.createdAt) && <NewBadge />}
            </Meta>
          </Header>
          <Divider />
          <Body>{notice.body}</Body>
        </Article>
      )}
    </Layout>
  )
}

const Layout = render.extend(PageLayout)

const Article = render.article('flex w-full flex-col px-20 pb-40')

const Header = render.div('flex flex-col gap-8 pt-12')

const Title = render.h2('break-words font-18-m text-gray-900')

const Meta = render.div('flex items-center gap-6')

const DateText = render.span('font-14-r text-gray-400')

const Divider = render.div('my-20 h-1 w-full bg-gray-100')

const Body = render.p('whitespace-pre-wrap break-words font-16-r text-gray-800')

const StateText = render.div('flex min-h-320 items-center justify-center font-16-m text-gray-400')

export default NoticeDetailPage
