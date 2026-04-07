import { ReactNode } from "react";
import render from "@/shared/ui/render";

interface MobileFrameProps {
  children: ReactNode;
}

const MobileFrame = ({ children }: MobileFrameProps) => {
  return (
    <Screen>
      <View>{children}</View>
    </Screen>
  );
};

const Screen = render.section("flex justify-center min-h-[100dvh] overflow-hidden box-border");

const View = render.main(
  "relative flex flex-col items-center box-border w-390 min-h-[100dvh] border-0 border-x border-border border-solid",
);

export default MobileFrame;
