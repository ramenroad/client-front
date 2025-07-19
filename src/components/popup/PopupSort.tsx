import React, { useState } from "react";
import tw from "twin.macro";
import { SortType } from "../../types/filter";
import styled from "@emotion/styled";
import { IconCheck, IconClose } from "../Icon";
import { ModalProps } from "../../types";
import { RamenroadText } from "../common/RamenroadText";
import { BottomPopupLayout } from "./BottomPopupLayout";

export interface PopupSortProps extends ModalProps {
  sortOption: SortType;
  onChange: (sortOption: SortType | null) => void;
}

const PopupSort: React.FC<PopupSortProps> = (props) => {
  const [sortOptions, setSortOptions] = useState<SortType>(props.sortOption);

  const handleSortChange = (sort: SortType) => {
    setSortOptions(sort);
    props.onChange(sort);
  };

  return (
    <BottomPopupLayout>
      <Wrapper>
        <Header>
          <RamenroadText size={18} weight="sb">
            정렬
          </RamenroadText>
          <CloseButton onClick={props.onClose} />
        </Header>

        <Section>
          {Object.values(SortType).map((sort) => (
            <Flex>
              <SectionTitle key={sort} selected={sortOptions === sort} onClick={() => handleSortChange(sort)}>
                {sort}
              </SectionTitle>
              {sortOptions === sort && <IconCheck />}
            </Flex>
          ))}
        </Section>
      </Wrapper>
    </BottomPopupLayout>
  );
};

export default PopupSort;

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
  flex justify-between items-center
  box-border
`;

const SectionTitle = styled.div(({ selected }: { selected?: boolean }) => [
  tw`font-16-r text-filter-text mb-4 cursor-pointer`,
  selected && tw`text-orange`,
]);
