import { ReactNode } from "react";
import tw from "twin.macro";

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

const Screen = tw.section`
  flex justify-center min-h-[100dvh] overflow-hidden box-border
`;

const View = tw.main`
  relative flex flex-col items-center box-border
  w-390 min-h-[100dvh]
  border-0 border-x border-border border-solid
`;

export default MobileFrame;
