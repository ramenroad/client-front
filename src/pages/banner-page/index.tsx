import { IconClose } from "../../components/Icon";
import { bannerImages } from "../../constants";
import tw from "twin.macro";
import { useNavigate } from "react-router-dom";
export const BannerPage = () => {
  
  const navigate = useNavigate();
  return (
    <Wrapper>
        <Header>
            <Title>전체 보기</Title>
            <StyledIconClose onClick={() => navigate("/")} />
        </Header>
        <BannerListContainer>
            {bannerImages.map((banner) => (
                <BannerImage key={banner.id} src={banner.image} alt="banner" />
            ))}
        </BannerListContainer>
    </Wrapper>
  )
}

const Wrapper = tw.div`
  flex flex-col items-center justify-center
`
const Header = tw.div`
  flex h-44 items-center justify-center w-full
  relative
`

const Title = tw.div`
  font-16-sb
`

const StyledIconClose = tw(IconClose)`
  w-14 h-14 cursor-pointer 
  absolute right-20
`
const BannerListContainer = tw.div`
  flex flex-col items-center justify-center
  px-20 gap-20
`
const BannerImage = tw.img`
  w-full h-full rounded-8
`

