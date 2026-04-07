import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { FilterOptions, RAMENYA_TYPES, SortType } from "@/entities/ramenya/model";
import { Button } from "@/shared/ui/button";
import { Toggle } from "@/shared/ui/toggle";
import { IconClose, IconPinned } from "@/shared/ui/icon";
import type { ModalProps } from "@/shared/model/popup";
import { BottomPopupLayout } from "@/shared/ui/popup/BottomPopupLayout";
import render from "@/shared/ui/render";

export interface PopupFilterProps extends ModalProps {
  initialFilterOptions: FilterOptions;
  currentFilterOptions: FilterOptions;
  pinned?: (typeof RAMENYA_TYPES)[keyof typeof RAMENYA_TYPES];
  onChange: (filterOptions: FilterOptions | null) => void;
}

const PopupFilter = ({ currentFilterOptions, initialFilterOptions, pinned, onChange, onClose }: PopupFilterProps) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(currentFilterOptions);

  const ramenyaGenre = useMemo(() => {
    const filteredTypes = Object.values(RAMENYA_TYPES).filter((type) => type !== pinned);
    return pinned ? [pinned, ...filteredTypes] : filteredTypes;
  }, [pinned]);

  const handleFilterChange = (type: keyof FilterOptions, value: string) => {
    if (type === "isOpen") {
      setFilterOptions((prev) => ({ ...prev, isOpen: !prev.isOpen }));
      return;
    }

    if (type === "sort") {
      setFilterOptions((prev) => ({
        ...prev,
        sort: value as SortType,
      }));
      return;
    }

    if (filterOptions[type].includes(value)) {
      setFilterOptions((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item !== value),
      }));
      return;
    }

    setFilterOptions((prev) => ({
      ...prev,
      [type]: [...prev[type], value],
    }));
  };

  return (
    <BottomPopupLayout>
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
              if (type === pinned) {
                return (
                  <FilterButton active pinned key={type}>
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
              setFilterOptions(initialFilterOptions);
              onChange(initialFilterOptions);
              onClose();
            }}
          >
            초기화
          </Button>
          <Button
            onClick={() => {
              onChange(filterOptions);
              onClose();
            }}
          >
            적용하기
          </Button>
        </Flex>
      </Wrapper>
    </BottomPopupLayout>
  );
};

const Wrapper = render.div("w-full flex flex-col gap-20");

const Header = render.div("flex items-center justify-between");

const Flex = render.div("flex justify-between items-center gap-8");

const Title = render.span("font-18-sb");

const CloseButton = render.extend(IconClose, "cursor-pointer");

const Section = render.div("flex flex-col gap-8 mb-12");

const SectionTitle = render.div("font-16-m text-black mb-4");

const ButtonGroup = render.div("flex gap-8 flex-wrap");

const FilterButton = styled.button<{ active?: boolean; pinned?: boolean }>(({ active, pinned }) => [
  {
    padding: "6px 12px",
    borderRadius: "50px",
    fontSize: "14px",
    lineHeight: "21px",
    fontWeight: 400,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#f6f6f6",
    color: "#a0a0a0",
    display: "flex",
    alignItems: "center",
    gap: "1.5px",
  },
  active && {
    backgroundColor: "#fff4eb",
    color: "#ff5e00",
  },
  pinned && {
    paddingLeft: "8px",
  },
]);

export default PopupFilter;
