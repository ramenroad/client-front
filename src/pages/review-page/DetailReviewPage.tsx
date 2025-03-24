import tw from 'twin.macro'
import TopBar from '../../components/common/TopBar'

export const DetailReviewPage = () => {
    return (
        <Wrapper>
            <Header>
                <TopBar title='리뷰 상세' />
            </Header>
        </Wrapper>
    )
}

const Wrapper = tw.div`
    flex flex-col pb-40
`

const Header = tw.div`
`

