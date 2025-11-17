import React from "react";
import tw from "twin.macro";
import styled from "@emotion/styled";
import { IconCheck, IconClose } from "../Icon";
import { ModalProps } from "../../types";
import { RaisingText } from "../common/RamenroadText";
import { BottomPopupLayout } from "./BottomPopupLayout";

export interface PopupSelectProps extends ModalProps {
  title: string;
  optionList: { label: string; value: string }[];
  currentOption?: { label: string; value: string };
  onSelect: (option: { label: string; value: string }) => void;
}

const PopupSelect: React.FC<PopupSelectProps> = (props) => {
  const handleOptionSelect = (option: { label: string; value: string }) => {
    props.onSelect(option);
    props.onClose();
  };

  return (
    <BottomPopupLayout>
      <Wrapper>
        <Header>
          <RaisingText size={18} weight="sb">
            {props.title}
          </RaisingText>
          <CloseButton onClick={props.onClose} />
        </Header>

        <Section>
          {props.optionList.map((option) => {
            const isSelected = props.currentOption?.value === option.value;
            return (
              <Flex key={option.value} onClick={() => handleOptionSelect(option)}>
                <SectionTitle selected={isSelected}>{option.label}</SectionTitle>
                {isSelected && <IconCheck />}
              </Flex>
            );
          })}
        </Section>
      </Wrapper>
    </BottomPopupLayout>
  );
};

export default PopupSelect;

const Wrapper = tw.div`
  w-350 max-w-350 flex flex-col gap-20
  box-border
`;

const Header = tw.div`
  flex items-center justify-between
  box-border
`;

const CloseButton = tw(IconClose)`
  cursor-pointer
`;

const Section = tw.div`
  flex flex-col gap-20 justify-between
  box-border
`;

const Flex = tw.div`
  flex justify-between items-center cursor-pointer
  box-border
`;

const SectionTitle = styled.div(({ selected }: { selected?: boolean }) => [
  tw`font-16-r text-filter-text mb-4 cursor-pointer`,
  selected && tw`text-orange`,
]);
