import React from 'react'
import TopBar from '../../../components/common/TopBar'
import tw from 'twin.macro'

export const ImagesPage = () => {
    return (
        <Wrapper>
            <Header>
                <TopBar title='이미지' />
            </Header>
        </Wrapper>
    )
}

const Wrapper = tw.div`
    flex flex-col pb-40
`

const Header = tw.div`
`

