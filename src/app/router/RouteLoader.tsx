import { RaisingText } from "@/shared/ui/text";
import render from "@/shared/ui/render";

export const RouteLoader = () => {
  return (
    <LoaderScreen>
      <LoaderText size={14} weight="m">
        불러오는 중...
      </LoaderText>
    </LoaderScreen>
  );
};

const LoaderScreen = render.section("flex min-h-[100dvh] w-full items-center justify-center bg-white");

const LoaderText = render.extend(RaisingText, "text-gray-500");
