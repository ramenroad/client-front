import styled from "@emotion/styled";
import tw from "twin.macro";

export const Line = styled.div(({ vertical }: { vertical?: boolean }) => [
  vertical ? tw`w-1 min-w-1 h-full` : tw`w-full h-1 min-h-1`,
  tw`bg-divider`,
]);
