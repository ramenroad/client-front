import { ComponentProps } from "react";
import tw from "twin.macro";

export const ReviewImage = (props: ComponentProps<"img">) => {
  return <Image {...props} />;
};

const Image = tw.img`
  w-full h-full
  object-cover cursor-pointer
`;
