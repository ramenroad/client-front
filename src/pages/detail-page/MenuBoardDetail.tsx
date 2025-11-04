import React, { useState, useEffect, useRef } from "react";
import tw from "twin.macro";
import { IconMore } from "../../components/Icon";
import dayjs from "dayjs";

interface MenuBoardDetailProps {
  profileImage: string;
  nickname: string;
  createdAt: string;
  description: string;
  isMine: boolean;
  onDelete: () => void;
}

export const MenuBoardDetail: React.FC<MenuBoardDetailProps> = ({
  profileImage,
  nickname,
  createdAt,
  description,
  isMine,
  onDelete,
}) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const iconMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iconMoreRef.current && !iconMoreRef.current.contains(event.target as Node)) {
        setIsTooltipOpen(false);
      }
    };

    if (isTooltipOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTooltipOpen]);

  return (
    <MenuBoardDetailWrapper>
      <Header>
        <WriterInfo>
          <ProfileImage src={profileImage} />
          <Nickname>{nickname}</Nickname>
          <Divider />
          <CreatedAt>{dayjs(createdAt).format("YYYY.MM.DD")}</CreatedAt>
        </WriterInfo>
        {isMine && (
          <IconMoreWrapper ref={iconMoreRef} onClick={() => setIsTooltipOpen(!isTooltipOpen)}>
            <IconMore width={20} color="#A0A0A0" />
            {isTooltipOpen && (
              <Tooltip onClick={() => onDelete()}>
                <TooltipText>삭제</TooltipText>
              </Tooltip>
            )}
          </IconMoreWrapper>
        )}
      </Header>
      <Description>{description}</Description>
    </MenuBoardDetailWrapper>
  );
};

const MenuBoardDetailWrapper = tw.div`
  relative
  w-240 h-84 bg-white bg-opacity-[0.12] rounded-8
  flex flex-col justify-center gap-10
  px-20 py-16
  text-black font-14-m
  box-border
`;

const Header = tw.div`
  flex items-center
`;

const WriterInfo = tw.div`
  flex items-center gap-6
`;

const IconMoreWrapper = tw.div`
  relative
  ml-auto
  cursor-pointer
`;

const ProfileImage = tw.img`
  w-24 h-24 rounded-full
`;

const Divider = tw.div`
  w-1 h-10 bg-gray-800
`;

const Nickname = tw.div`
  font-14-r text-gray-200
  leading-18
  w-60 truncate
`;

const CreatedAt = tw.div`
  font-12-l text-gray-400
`;

const Description = tw.div`
  font-14-r text-white
  truncate
`;

const Tooltip = tw.div`
  absolute mt-4
  w-48 h-37 bg-gray-700 rounded-8
  flex items-center justify-center
  z-10
  left-[-24px]
`;

const TooltipText = tw.div`
  text-gray-200 font-12-m
`;
