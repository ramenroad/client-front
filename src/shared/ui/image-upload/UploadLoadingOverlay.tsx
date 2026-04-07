import { memo, useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/lotties/loading.json";
import { isMobileDevice } from "@/shared/lib/image";
import render from "@/shared/ui/render";

interface UploadLoadingOverlayProps {
  mobileFallbackText?: string;
}

export const UploadLoadingOverlay = memo(
  ({ mobileFallbackText = "처리중..." }: UploadLoadingOverlayProps) => {
    const [shouldRenderAnimation, setShouldRenderAnimation] = useState(true);
    const isMobile = useMemo(() => isMobileDevice(), []);

    useEffect(() => {
      if (!isMobile) {
        return;
      }

      const timer = setTimeout(() => {
        setShouldRenderAnimation(false);
      }, 3000);

      return () => clearTimeout(timer);
    }, [isMobile]);

    return (
      <Overlay>
        {shouldRenderAnimation || !isMobile ? (
          <LottieContainer>
            <Lottie animationData={loadingAnimation} loop={true} autoplay={true} />
          </LottieContainer>
        ) : (
          <MobileLoadingText>{mobileFallbackText}</MobileLoadingText>
        )}
      </Overlay>
    );
  },
);

const Overlay = render.div(
  "fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col items-center justify-start bg-[#000000]/20 pt-[40vh]",
);

const LottieContainer = render.div("");

const MobileLoadingText = render.div("py-4 text-center font-16-m text-white");
