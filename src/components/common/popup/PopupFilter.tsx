import React, { useMemo, useState } from "react";
import tw from "twin.macro";
import { FilterOptions, SortType } from "../../../types/filter";
import { Toggle } from "../Toggle";
import { RAMENYA_TYPES } from "../../../constants";
import styled from "@emotion/styled";
import { IconClose, IconPinned } from "../../Icon";
import { Button } from "../Button";
import { ModalProps } from "../../../types";
import { BottomPopupLayout } from "./common";

export interface PopupFilterProps extends ModalProps {
  initialFilterOptions: FilterOptions;
  currentFilterOptions: FilterOptions;
  pinned?: (typeof RAMENYA_TYPES)[number];
  onChange: (filterOptions: FilterOptions | null) => void;
}

const PopupFilter: React.FC<PopupFilterProps> = (props) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(props.currentFilterOptions);

  const ramenyaGenre = useMemo(() => {
    const filteredTypes = RAMENYA_TYPES.filter((type) => type !== props.pinned);
    return props.pinned ? [props.pinned, ...filteredTypes] : filteredTypes;
  }, [props.pinned]);

  const handleFilterChange = (type: keyof FilterOptions, value: string) => {
    if (type === "isOpen") {
      setFilterOptions((prev) => ({ ...prev, isOpen: !prev.isOpen }));
    } else {
      if (type === "sort") {
        setFilterOptions((prev) => ({
          ...prev,
          sort: value as SortType,
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
    <BottomPopupLayout>
      <Wrapper>
        <Header>
          <Title>필터</Title>
          <CloseButton onClick={props.onClose} />
        </Header>
        <Section>
          <Flex>
            <SectionTitle>영업중</SectionTitle>
            <Toggle
              checked={filterOptions.isOpen}
              onChange={(checked) => setFilterOptions((prev) => ({ ...prev, isOpen: checked }))}
              onText="ON"
              offText="OFF"
            />
          </Flex>
        </Section>
        <Section>
          <SectionTitle>정렬</SectionTitle>
          <ButtonGroup>
            {Object.values(SortType).map((type) => (
              <FilterButton
                active={filterOptions.sort === type}
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
            {ramenyaGenre.map((type) => {
              if (type === props.pinned) {
                return (
                  <FilterButton active={true} pinned key={type}>
                    <IconPinned />
                    {type}
                  </FilterButton>
                );
              }
              return (
                <FilterButton
                  active={filterOptions.genre.includes(type)}
                  key={type}
                  onClick={() => handleFilterChange("genre", type)}
                >
                  {type}
                </FilterButton>
              );
            })}
          </ButtonGroup>
        </Section>
        <Flex>
          <Button
            variant="secondary"
            onClick={() => {
              setFilterOptions(props.initialFilterOptions);
              props.onChange(props.initialFilterOptions);
              props.onClose();
            }}
          >
            초기화
          </Button>
          <Button
            onClick={() => {
              props.onChange(filterOptions);
              props.onClose();
            }}
          >
            적용하기
          </Button>
        </Flex>
      </Wrapper>
    </BottomPopupLayout>
  );
};

export default PopupFilter;

const Wrapper = tw.div`
  w-full flex flex-col gap-20
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
  pinned?: boolean;
}

const FilterButton = styled.button<FilterButtonProps>(({ active, pinned }) => [
  tw`
    px-12 py-6 rounded-50 font-14-r border-none cursor-pointer
    bg-filter-background text-filter-text
    flex items-center gap-[1.5px]
  `,
  active && tw`bg-filter-active-background text-filter-active-text`,
  pinned && tw`pl-8`,
]);
