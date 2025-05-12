import React, { useState } from "react";
import tw from "twin.macro";
import { FilterOptions } from "../../types/filter";
import { Toggle } from "./Toggle";
import { RAMENYA_TYPES, SORT_TYPES } from "../../constants";
import styled from "@emotion/styled";
import { IconClose } from "../Icon";
import { Button } from "./Button";

interface PopupFilterProps {
  onClose: () => void;
}

export const PopupFilter: React.FC<PopupFilterProps> = ({ onClose }) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    isOpen: true,
    sort: [],
    genre: [],
  });

  const handleFilterChange = (type: keyof FilterOptions, value: string) => {
    if (type === "isOpen") {
      setFilterOptions((prev) => ({ ...prev, isOpen: !prev.isOpen }));
    } else {
      if (type === "sort") {
        setFilterOptions((prev) => ({
          ...prev,
          sort: [value],
        }));
      } else {
        if (filterOptions[type].includes(value)) {
          setFilterOptions((prev) => ({
            ...prev,
            [type]: prev[type].filter((item) => item !== value),
          }));
        } else {
          setFilterOptions((prev) => ({
            ...prev,
            [type]: [...prev[type], value],
          }));
        }
      }
    }
  };

  return (
    <Wrapper>
      <Header>
        <Title>필터</Title>
        <CloseButton onClick={onClose} />
      </Header>
      <Section>
        <Flex>
          <SectionTitle>영업중</SectionTitle>
          <Toggle
            checked={filterOptions.isOpen}
            onChange={(checked) =>
              setFilterOptions((prev) => ({ ...prev, isOpen: checked }))
            }
          />
        </Flex>
      </Section>
      <Section>
        <SectionTitle>정렬</SectionTitle>
        <ButtonGroup>
          {SORT_TYPES.map((type) => (
            <FilterButton
              active={filterOptions.sort.includes(type)}
              key={type}
              onClick={() => handleFilterChange("sort", type)}
            >
              {type}
            </FilterButton>
          ))}
        </ButtonGroup>
      </Section>
      <Section>
        <SectionTitle>장르</SectionTitle>
        <ButtonGroup>
          {RAMENYA_TYPES.map((type) => (
            <FilterButton
              active={filterOptions.genre.includes(type)}
              key={type}
              onClick={() => handleFilterChange("genre", type)}
            >
              {type}
            </FilterButton>
          ))}
        </ButtonGroup>
      </Section>
      <Flex>
        <Button>적용하기</Button>
        <Button variant="secondary">초기화</Button>
      </Flex>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  w-full max-w-400 flex flex-col gap-20
`;
const Header = tw.div`
  flex items-center justify-between
`;
const Flex = tw.div`
  flex justify-between items-center gap-8
`;
const Title = tw.span`
  font-18-sb
`;
const CloseButton = tw(IconClose)`
  cursor-pointer
`;
const Section = tw.div`
  flex flex-col gap-8 mb-12
`;
const SectionTitle = tw.div`
  font-16-m text-black mb-4
`;
const ButtonGroup = tw.div`
  flex gap-8 flex-wrap
`;

interface FilterButtonProps {
  active?: boolean;
}

const FilterButton = styled.button<FilterButtonProps>(({ active }) => [
  tw`
    px-12 py-6 rounded-50 font-14-r border-none cursor-pointer
    bg-filter-background text-filter-text
  `,
  active && tw`bg-filter-active-background text-filter-active-text`,
]);
