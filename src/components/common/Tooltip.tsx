import React, { useState, useRef, useEffect } from "react";
import tw from "twin.macro";
import styled from "@emotion/styled";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  title?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, title }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      // 툴팁을 트리거 요소 아래 중앙에 위치시키기
      const left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
      const top = triggerRect.bottom + 8; // 8px 간격

      setPosition({ top, left });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isVisible]);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      tooltipRef.current &&
      !tooltipRef.current.contains(event.target as Node) &&
      triggerRef.current &&
      !triggerRef.current.contains(event.target as Node)
    ) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isVisible]);

  return (
    <>
      <TriggerWrapper ref={triggerRef} onClick={handleClick}>
        {children}
      </TriggerWrapper>

      {isVisible && (
        <TooltipContainer
          ref={tooltipRef}
          style={{
            position: "fixed",
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 1000,
          }}
        >
          <TooltipContent>
            {title && <TooltipTitle>{title}</TooltipTitle>}
            <TooltipText>{content}</TooltipText>
          </TooltipContent>
          <TooltipArrow />
        </TooltipContainer>
      )}
    </>
  );
};

const TriggerWrapper = tw.div`
  cursor-pointer
  h-24
`;

const TooltipContainer = styled.div`
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
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

const TooltipContent = tw.div`
  rounded-lg
  shadow-lg
  border
  border-gray-200
  py-8
  px-12
  max-w-xs
  relative
  bg-[#414141]
`;

const TooltipTitle = tw.div`
  font-semibold
  text-white
  text-lg
  mb-2
`;

const TooltipText = tw.div`
  font-12-m
  text-white
  leading-relaxed
`;

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
