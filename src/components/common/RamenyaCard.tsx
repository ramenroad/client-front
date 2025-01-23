import { Ramenya } from "../../types";
import { checkBusinessStatus } from "../../util";
import tw from "twin.macro";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import storeImage from "../../assets/images/store.png";
import { OpenStatus } from "../../constants";
interface RamenyaCardProps {
  ramenya: Ramenya;
}

const RamenyaCard = (props: RamenyaCardProps) => {
  const { ramenya } = props;
  const navigate = useNavigate();

  return (
    <Wrapper
      key={ramenya._id}
      onClick={() => navigate(`/detail/${ramenya._id}`)}
    >
      <Layout>
        <RamenyaThumbnail
          src={ramenya.thumbnailUrl || storeImage}
          isImageExist={!!ramenya.thumbnailUrl}
          alt={"Thumbnail"}
        />
        <RamenyaDescription>
          <RamenyaTitle>{ramenya.name}</RamenyaTitle>
          <RamenyaAddress>{ramenya.address}</RamenyaAddress>
          <RamenyaOpenStatusWrapper>
            <RamenyaOpenStatus
              status={checkBusinessStatus(ramenya.businessHours).status}
            >
              {checkBusinessStatus(ramenya.businessHours).status}
            </RamenyaOpenStatus>
            <span>·</span>
            <RamenyaOpenTime>
              {checkBusinessStatus(ramenya.businessHours).todayHours
                ?.operatingTime || ""}
            </RamenyaOpenTime>
          </RamenyaOpenStatusWrapper>
          <RamenyaTagWrapper>
            {ramenya.genre.map((genre, index) => (
              <RamenyaTag key={index}>{genre}</RamenyaTag>
            ))}
          </RamenyaTagWrapper>
        </RamenyaDescription>
      </Layout>
    </Wrapper>
  );
};

const Wrapper = tw.section`
  w-full gap-10 cursor-pointer
  box-border px-20 py-20
`;

const Layout = tw.section`
  w-full flex gap-16 items-center
`;

const RamenyaThumbnail = styled.img(
  ({ isImageExist }: { isImageExist: boolean }) => [
    tw`w-100 h-100 object-cover rounded-lg
  border border-solid border-border`,
    !isImageExist ? tw`object-contain` : tw`object-cover`,
  ],
);

const RamenyaDescription = tw.section`
  w-full h-full flex flex-col flex-1
`;

const RamenyaTitle = tw.span`
  font-16-sb mb-6 h-19
`;

const RamenyaAddress = tw.span`
  font-14-r text-gray-700 mb-12 h-17
`;

const RamenyaOpenStatusWrapper = tw.span`
  flex gap-2 items-center font-12-r h-14
`;

const RamenyaOpenStatus = styled.span(({ status }: { status: OpenStatus }) => [
  status === OpenStatus.OPEN
    ? tw`text-green`
    : status === OpenStatus.BREAK
      ? tw`text-orange`
      : tw`text-red`,
]);

const RamenyaOpenTime = tw.span`
  font-12-r
`;

const RamenyaTagWrapper = tw.section`
  mt-4 flex gap-4
`;

const RamenyaTag = tw.span`
  font-10-r text-gray-700 rounded-sm bg-border p-2
`;

export default RamenyaCard;
