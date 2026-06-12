import { POLICY_ITEMS } from '@/entities/support/model'
import { openUrl } from '@/shared/lib/browser'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import TopBar from '@/shared/ui/top-bar'

const PolicyPage = () => {
  return (
    <Layout variant="standalone">
      <TopBar title="약관 및 정책" />
      <List>
        {POLICY_ITEMS.map((item) => (
          <Item key={item.title} type="button" onClick={() => openUrl(item.url)}>
            {item.title}
          </Item>
        ))}
      </List>
    </Layout>
  )
}

const Layout = render.extend(PageLayout)

const List = render.section('flex w-full flex-col px-20')

const Item = render.button(
  'flex h-60 w-full cursor-pointer items-center border-0 border-b border-solid border-gray-100 bg-transparent px-0 text-left font-16-m text-gray-900 shadow-none outline-none',
)

export default PolicyPage
