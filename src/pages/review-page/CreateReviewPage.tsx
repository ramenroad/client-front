import React from 'react'
import TopBar from '../../components/common/TopBar.tsx'
import tw from 'twin.macro'
import { IconStarLarge } from '../../components/Icon/index.tsx'

export const CreateReviewPage = () => {
    return (
        <Wrapper>
            <Header>
                <TopBar title="리뷰 작성하기" />
            </Header>
            <ContentsWrapper>
                <StarWrapper>
                    <StarTitle>라멘은 만족하셨나요?</StarTitle>
                    <StarContainer>
                        <IconStarLarge color="#E1E1E1" />
                        <IconStarLarge color="#E1E1E1" />
                        <IconStarLarge color="#E1E1E1" />
                        <IconStarLarge color="#E1E1E1" />
                        <IconStarLarge color="#E1E1E1" />
                    </StarContainer>
                </StarWrapper>
                <Divider />

                <MenuWrapper>
                    <MenuTitleBox>
                        <MenuTitle>어떤 메뉴를 드셨나요?</MenuTitle>
                        <MenuSubTitle>최대 2개 선택 가능</MenuSubTitle>
                    </MenuTitleBox>
                    <MenuTabContainer>
                        <MenuTab>라멘러ㅏ멘레ㅏ멘</MenuTab>
                        <MenuTab>라멘</MenuTab>
                        <MenuTab>라멘리ㅏㅔㅁㄴ라멘</MenuTab>
                        <MenuTab>라멘</MenuTab>
                        <MenuTab>라멘</MenuTab>
                        <MenuTab>라멘리ㅏㅔㅁㄴ라멘</MenuTab>
                        <MenuTab>라멘</MenuTab>
                        <MenuTab>라멘</MenuTab>
                    </MenuTabContainer>
                </MenuWrapper>

                <MenuAddWrapper>
                    <MenuAddTitle>찾으시는 메뉴가 없나요? 직접 추가해주세요</MenuAddTitle>
                    <MenuInputContainer>
                        <MenuInput />
                        <MenuAddButton>추가</MenuAddButton>
                    </MenuInputContainer>
                </MenuAddWrapper>

                <ReviewDescriptionWrapper>
                    <ReviewDescriptionTitle>어떤 점이 좋았나요?</ReviewDescriptionTitle>
                    <ReviewDescriptionTextarea />
                </ReviewDescriptionWrapper>

                <ImageUploadWrapper>

                    <ImageUploadHeader>
                        <ImageUploadTitleBox>
                            <ImageUploadTitle>사진 첨부</ImageUploadTitle>
                            <ImageAdded>0</ImageAdded>
                            <ImageAddedText>/</ImageAddedText>
                            <ImageMax>5</ImageMax>
                        </ImageUploadTitleBox>
                        <ImageUploadSubTitle>라멘과 무관한 사진을 첨부한 리뷰는 무통보 삭제됩니다</ImageUploadSubTitle>
                    </ImageUploadHeader>

                    <ImageUploadContent>
                        <ImageUploadContentImage>

                        </ImageUploadContentImage>
                    </ImageUploadContent>

                </ImageUploadWrapper>

                <AddReviewButton>등록하기</AddReviewButton>

            </ContentsWrapper>
        </Wrapper>
    )
}

const Wrapper = tw.div`
    flex flex-col pb-40
`

const Header = tw.div`
`

const ContentsWrapper = tw.div`
    flex flex-col
    px-20
`

const StarWrapper = tw.div`
    flex flex-col
    items-center
    pt-20
    pb-32
    gap-12
`

const StarTitle = tw.div`
    font-16-m text-black
`

const StarContainer = tw.div`
    flex gap-8 items-center
`

const Divider = tw.div`
    w-full h-1 bg-divider
`

const MenuWrapper = tw.div`
    flex flex-col mt-32 gap-12
`

const MenuTitleBox = tw.div`
    flex
    gap-4
`

const MenuTitle = tw.div`
    font-16-m text-black
`

const MenuSubTitle = tw.div`
    font-12-r text-gray-400
`

const MenuTabContainer = tw.div`
    flex flex-wrap gap-8
`

const MenuTab = tw.div`    flex w-fit h-29 
    items-center
    font-14-m text-gray-400
    py-4 px-12 rounded-8 bg-border
`

const MenuAddWrapper = tw.div`
    flex flex-col mt-20 gap-12
`

const MenuAddTitle = tw.div`
    font-14-r text-black
`

const MenuInputContainer = tw.div`
    flex items-center gap-4
`

const MenuInput = tw.input`
    flex-1 h-44 rounded-8 
    bg-border
    border-none
`

const MenuAddButton = tw.button`
    w-67 h-43 rounded-8 text-black
    px-10 py-8 bg-white
    border-solid border-1 border-gray-100
`

const ReviewDescriptionWrapper = tw.div`
    flex flex-col mt-32 gap-12
`

const ReviewDescriptionTitle = tw.div`
    font-16-m text-black
`

const ReviewDescriptionTextarea = tw.textarea`
    flex h-260 
    px-12 py-10
    rounded-8 bg-border
    border-none
`

const ImageUploadWrapper = tw.div`
    flex flex-col mt-32 gap-12
`

const ImageUploadHeader = tw.div`
    flex flex-col gap-2
`

const ImageUploadTitleBox = tw.div`
    flex items-center gap-8
`

const ImageUploadTitle = tw.div`
    font-16-m text-black
`

const ImageAdded = tw.div`
    font-16-m text-black
`

const ImageAddedText = tw.div`
    font-16-m text-black
`

const ImageMax = tw.div`
    font-16-m text-black
`

const ImageUploadSubTitle = tw.div`
    font-12-r text-gray-400
`

const ImageUploadContent = tw.div`
    flex flex-col gap-12
`

const ImageUploadContentImage = tw.div`
    flex flex-col gap-12
`

const AddReviewButton = tw.button`
    flex items-center justify-center
    mt-32
    w-full h-48 rounded-8 text-black
    px-10 py-10 bg-gray-200
    border-none
`
















