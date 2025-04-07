import { ComponentProps } from "react";
import tw from "twin.macro";

export const Button = (props: ComponentProps<"button">) => {
  return <ButtonWrapper {...props} />;
};

const ButtonWrapper = tw.button`
  w-full h-48
  bg-orange text-white shadow-none  font-16-sb
  rounded-8 border-none py-12
  cursor-pointer
`;
