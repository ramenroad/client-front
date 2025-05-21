import React, { useState } from "react";
import tw from "twin.macro";
import { SortType } from "../../../types/filter";
import styled from "@emotion/styled";
import { IconCheck, IconClose } from "../../Icon";
import { ModalProps } from "../../../types";

export interface PopupSortProps {
  sortOption: SortType;
  onChange: (sortOption: SortType | null) => void;
}

export const PopupSort: React.FC<PopupSortProps & ModalProps> = (props) => {
  const [sortOptions, setSortOptions] = useState<SortType>(props.sortOption);

  const handleSortChange = (sort: SortType) => {
    setSortOptions(sort);
    props.onChange(sort);
  };

  return (
    <Wrapper>
      <Header>
        <Title>정렬</Title>
        <CloseButton onClick={props.onClose} />
      </Header>
      <Section>
        {Object.values(SortType).map((sort) => (
          <Flex>
            <SectionTitle
              key={sort}
              selected={sortOptions === sort}
              onClick={() => handleSortChange(sort)}
            >
              {sort}
            </SectionTitle>
            {sortOptions === sort && <IconCheck />}
          </Flex>
        ))}
      </Section>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  w-full max-w-400 flex flex-col gap-20
`;
const Header = tw.div`
  flex items-center justify-between
`;
const Title = tw.span`
  font-18-sb
`;
const CloseButton = tw(IconClose)`
  cursor-pointer
`;
const Section = tw.div`
  flex flex-col gap-20 justify-between
`;
const Flex = tw.div`
  flex justify-between items-center
`;
const SectionTitle = styled.div(({ selected }: { selected?: boolean }) => [
  tw`font-16-r text-filter-text mb-4 cursor-pointer`,
  selected && tw`text-orange`,
]);
