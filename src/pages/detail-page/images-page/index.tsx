import { useParams } from 'react-router-dom';
import TopBar from '../../../components/common/TopBar'
import tw from 'twin.macro'
import { useRamenyaReviewImagesQuery } from '../../../hooks/queries/useRamenyaReviewQuery';
import { useEffect } from 'react';

export const ImagesPage = () => {
    const { id } = useParams();
    const ramenyaReviewImagesQuery = useRamenyaReviewImagesQuery(id!);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <Wrapper>
            <Header>
                <TopBar title='이미지' />
            </Header>
            <ImageContainer>
                {ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls?.map((image: string, index: number) => (
                    <Image key={index} src={image} />
                ))}
            </ImageContainer>
        </Wrapper>
    )
}

const Wrapper = tw.div`
    flex flex-col pb-40 gap-20
`

const Header = tw.div`
`

const ImageContainer = tw.div`
    grid grid-cols-3 gap-1
`

const Image = tw.img`
    w-full aspect-square object-cover
`