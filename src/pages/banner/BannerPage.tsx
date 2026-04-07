import { IconClose } from "@/shared/ui/icon";
import { useNavigate } from "react-router-dom";
import { useBannerQuery } from "@/entities/curation/model";
import { isExternalUrl, openUrl } from "@/shared/lib/browser";
import render from "@/shared/ui/render";

export const BannerPage = () => {
  const navigate = useNavigate();

  const { bannerQuery } = useBannerQuery();
  const { data: bannerData } = bannerQuery;
  return (
    <Wrapper>
      <Header>
        <Title>전체 보기</Title>
        <StyledIconClose onClick={() => navigate("/")} />
      </Header>
      <BannerListContainer>
        {bannerData?.map((banner) => (
          <BannerImage
            key={banner._id}
            src={banner.bannerImageUrl}
            alt="banner"
            onClick={() => {
              const url = banner.redirectUrl;
              if (isExternalUrl(url)) {
                openUrl(url);
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

const Wrapper = render.div("flex flex-col items-center h-full");
const Header = render.div("flex h-44 items-center justify-center w-full relative");

const Title = render.div("font-16-sb");

const StyledIconClose = render.extend(IconClose, "w-14 h-14 cursor-pointer absolute right-20");

const BannerListContainer = render.div("flex flex-col items-center justify-center px-20 pt-10 gap-20");

const BannerImage = render.img("w-350 h-200 rounded-[8px] cursor-pointer");
