import { Fragment, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { type Ramenya } from "@/entities/ramenya/model";
import RamenyaCard from "@/entities/ramenya/ui";
import render from "@/shared/ui/render";

interface RamenyaListViewProps {
  ramenyas?: Ramenya[];
  emptyContent?: ReactNode;
  centered?: boolean;
  dividerInset?: boolean;
  isReview?: boolean;
}

export const RamenyaListView = ({
  ramenyas,
  emptyContent = null,
  centered = false,
  dividerInset = false,
  isReview,
}: RamenyaListViewProps) => {
  const navigate = useNavigate();

  if (!ramenyas) {
    return null;
  }

  if (ramenyas.length === 0) {
    return <>{emptyContent}</>;
  }

  return (
    <ListWrapper centered={centered}>
      {ramenyas.map((ramenya, index) => (
        <Fragment key={ramenya._id}>
          <RamenyaCard {...ramenya} isReview={isReview} onClick={() => navigate(`/detail/${ramenya._id}`)} />
          {index !== ramenyas.length - 1 && <Divider className={dividerInset ? "mx-20" : ""} />}
        </Fragment>
      ))}
    </ListWrapper>
  );
};

const ListWrapper = styled.div<{ centered: boolean }>(({ centered }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  ...(centered
    ? {
        alignItems: "center",
        justifyContent: "center",
      }
    : {}),
}));

const Divider = render.div("w-full h-1 bg-border box-border");
