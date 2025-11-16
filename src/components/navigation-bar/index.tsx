import styled from "@emotion/styled/macro";
import React, { useState, useRef, useEffect } from "react";
import tw from "twin.macro";

export interface NavigationItem {
  label: string;
  value: string;
}

interface NavigationBarProps {
  items: NavigationItem[];
  defaultActiveValue?: string;
  onItemClick?: (item: NavigationItem) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  items,
  defaultActiveValue = items[0]?.value,
  onItemClick,
}) => {
  const [activeValue, setActiveValue] = useState(defaultActiveValue);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement }>({});

  const handleItemClick = (item: NavigationItem) => {
    setActiveValue(item.value);
    onItemClick?.(item);
  };

  useEffect(() => {
    const activeButton = buttonRefs.current[activeValue];
    if (activeButton && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      setUnderlineStyle({
        left: buttonRect.left - navRect.left,
        width: buttonRect.width,
      });
    }
  }, [activeValue]);

  return (
    <NavigationContainer>
      <NavigationList ref={navRef}>
        {items.map((item) => (
          <NavigationButton
            key={item.value}
            ref={(el) => {
              if (el) buttonRefs.current[item.value] = el;
            }}
            active={activeValue === item.value}
            onClick={() => handleItemClick(item)}
          >
            {item.label}
          </NavigationButton>
        ))}
        <ActiveUnderline style={underlineStyle} />
      </NavigationList>
    </NavigationContainer>
  );
};

const NavigationContainer = tw.nav`
  flex items-center
  w-full h-44
  px-20
  box-border
  flex-shrink-0
`;

const NavigationList = tw.div`
  flex items-center gap-0
  relative
`;

const NavigationButton = styled.button<{ active: boolean }>(({ active }) => [
  tw`
    font-16-sb bg-white text-black
    px-12 py-8
    flex items-center justify-center
    relative
    border-none outline-none
    transition-colors duration-200
    cursor-pointer
  `,
  active ? tw`text-gray-800` : tw`text-gray-400`,
]);

const ActiveUnderline = tw.div`
  absolute bottom-0
  h-2 bg-navigation-underline
  rounded-full
  transition-all duration-300 ease-in-out
`;
