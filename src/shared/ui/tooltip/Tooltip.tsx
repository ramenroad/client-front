import { useState, useRef, useEffect, type ReactNode } from "react";
import styled from "@emotion/styled";
import render from "@/shared/ui/render";

interface TooltipProps {
  children: ReactNode;
  content: string;
  title?: string;
}

const Tooltip = ({ children, content, title }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  return (
    <TooltipRoot ref={rootRef}>
      <TriggerWrapper onClick={() => setIsVisible((prev) => !prev)}>{children}</TriggerWrapper>

      {isVisible && (
        <PanelAnchor>
          <TooltipPanel>
            {title && <TooltipTitle>{title}</TooltipTitle>}
            <TooltipText>{content}</TooltipText>
            <TooltipArrow />
          </TooltipPanel>
        </PanelAnchor>
      )}
    </TooltipRoot>
  );
};

const TooltipRoot = render.div("relative flex h-24 shrink-0");

const TriggerWrapper = render.div("flex h-24 cursor-pointer items-center");

// 트리거 바로 아래에 건다. 뷰포트 좌표(getBoundingClientRect + position:fixed)로는 배치할 수 없다 —
// Stackflow AppScreen이 전환 후에도 transform을 유지하므로 fixed의 기준이 뷰포트가 아니라 화면 컨테이너가 되고,
// 웹에서 390 프레임이 가운데 정렬된 만큼 툴팁이 프레임 밖으로 밀려난다.
//
// 가로 중앙 정렬은 폭 0 + justify-center로 만든다(패널이 좌우로 같은 만큼 넘쳐 트리거 중심에 맞는다).
// translate를 쓰지 않는 이유는 등장 애니메이션이 이미 transform을 쓰기 때문이다.
const PanelAnchor = render.div("absolute left-1/2 top-full z-10 flex w-0 justify-center pt-8");

const FadeIn = styled.div`
  animation: tooltipFadeIn 0.2s ease-in-out;

  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TooltipPanel = render.extend(
  FadeIn,
  "relative max-w-xs shrink-0 rounded-lg border border-gray-200 bg-[#414141] px-12 py-8 shadow-lg",
);

const TooltipTitle = render.div("font-semibold text-white text-lg mb-2");

const TooltipText = render.div("font-12-m text-white leading-relaxed");

const TooltipArrow = styled.div`
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #414141;

  &::before {
    content: "";
    position: absolute;
    top: 1px;
    left: -7px;
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid #414141;
  }
`;

export default Tooltip;
