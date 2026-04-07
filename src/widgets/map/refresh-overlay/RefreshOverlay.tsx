import { RaisingText } from "@/shared/ui/text";
import { IconRefresh } from "@/shared/ui/icon";
import render from "@/shared/ui/render";

interface RefreshOverlayProps {
  onRefresh: () => void;
}

export const RefreshOverlay = ({ onRefresh }: RefreshOverlayProps) => {
  return (
    <Container onClick={onRefresh}>
      <Button type="button">
        <IconRefresh />
        <ButtonText size={12} weight="m">
          현재 위치 재검색
        </ButtonText>
      </Button>
    </Container>
  );
};

const Container = render.div("absolute-center-x absolute top-80 z-10");

const Button = render.button(
  "z-10 flex h-34 w-125 cursor-pointer items-center gap-4 rounded-[50px] border-none bg-white px-14 py-8 shadow outline-none",
);

const ButtonText = render.extend(RaisingText, "whitespace-nowrap text-gray-700");
