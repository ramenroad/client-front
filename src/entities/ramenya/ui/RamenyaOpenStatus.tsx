import styled from "@emotion/styled";
import { OpenStatus } from "@/entities/ramenya/model";

export const RamenyaOpenStatus = styled.span<{ status: OpenStatus }>(({ status }) => ({
  color:
    status === OpenStatus.BEFORE_OPEN
      ? "#585858"
      : status === OpenStatus.OPEN
        ? "#59bc12"
        : status === OpenStatus.BREAK
          ? "#f3a216"
          : status === OpenStatus.DAY_OFF
            ? "#ff5454"
            : status === OpenStatus.CLOSED
              ? "#838383"
              : undefined,
}));
