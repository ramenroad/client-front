import { IconClose } from "../../components/Icon";
import tw from "twin.macro";
import { useNavigate } from "react-router-dom";
import { useBannerQuery } from "../../hooks/queries/useBannerQuery";

export const BannerPage = () => {
  const navigate = useNavigate();

  const { data: bannerData } = useBannerQuery();
  return (
    <Wrapper>
      <Header>
        <Title>전체 보기</Title>
        <StyledIconClose onClick={() => navigate("/")} />
      </Header>
      <BannerListContainer>
        {bannerData?.map((banner) => (
          <BannerImage
            key={banner.id}
            src={banner.bannerImageUrl}
            alt="banner"
            onClick={() => {
              const url = banner.redirectUrl;
              if (url.startsWith("http://") || url.startsWith("https://")) {
                window.open(url, "_blank");
              } else {
                navigate(url);
              }
            }}
          />
        ))}
      </BannerListContainer>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col items-center h-full
`;
const Header = tw.div`
  flex h-44 items-center justify-center w-full
  relative
`;

const Title = tw.div`
  font-16-sb
`;

const StyledIconClose = tw(IconClose)`
  w-14 h-14 cursor-pointer 
  absolute right-20
`;

const BannerListContainer = tw.div`
  flex flex-col items-center justify-center
  px-20 gap-20
`;

const BannerImage = tw.img`
  w-350 h-200 rounded-8 cursor-pointer
`;
