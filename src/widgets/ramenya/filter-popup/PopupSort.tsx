import { useState } from "react";
import styled from "@emotion/styled";
import { SortType } from "@/entities/ramenya/model";
import { RaisingText } from "@/shared/ui/text";
import { IconCheck, IconClose } from "@/shared/ui/icon";
import type { ModalProps } from "@/shared/model/popup";
import { BottomPopupLayout } from "@/shared/ui/popup/BottomPopupLayout";
import render from "@/shared/ui/render";

export interface PopupSortProps extends ModalProps {
  sortOption: SortType;
  onChange: (sortOption: SortType | null) => void;
}

const PopupSort = ({ sortOption, onChange, onClose }: PopupSortProps) => {
  const [sortOptions, setSortOptions] = useState<SortType>(sortOption);

  const handleSortChange = (sort: SortType) => {
    setSortOptions(sort);
    onChange(sort);
  };

  return (
    <BottomPopupLayout>
      <Wrapper>
        <Header>
          <RaisingText size={18} weight="sb">
            정렬
          </RaisingText>
          <CloseButton onClick={onClose} />
        </Header>
        <Section>
          {Object.values(SortType).map((sort) => (
            <Flex key={sort}>
              <SectionTitle selected={sortOptions === sort} onClick={() => handleSortChange(sort)}>
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

const Wrapper = render.div("w-350 max-w-350 flex flex-col gap-20 box-border");

const Header = render.div("flex items-center justify-between box-border");

const CloseButton = render.extend(IconClose, "cursor-pointer");

const Section = render.div("flex flex-col gap-20 justify-between box-border");

const Flex = render.div("flex justify-between items-center box-border");

const SectionTitle = styled.div<{ selected?: boolean }>(({ selected }) => [
  {
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: 400,
    color: "#a0a0a0",
    marginBottom: "4px",
    cursor: "pointer",
  },
  selected && {
    color: "#ff5e00",
  },
]);

export default PopupSort;
