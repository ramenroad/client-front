import styled from "@emotion/styled";
import { ComponentProps } from "react";
import tw from "twin.macro";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "gray";
}

export const Button = ({ variant = "primary", ...props }: ButtonProps) => {
  return <ButtonWrapper variant={variant} {...props} />;
};

const ButtonWrapper = styled.button<{ variant: "primary" | "secondary" | "gray"; disabled?: boolean }>(
  ({ variant, disabled }) => [
    tw`
    w-full h-48
    bg-orange text-white shadow-none  font-16-sb
    rounded-8 border-none py-12
    cursor-pointer
`,
    variant === "primary" && tw`bg-orange text-white border-gray-500`,
    variant === "secondary" && tw`bg-white text-gray-700 border border-solid border-gray-500`,
    variant === "gray" && tw`bg-border text-gray-900`,
    disabled && tw`bg-gray-200 cursor-not-allowed`,
  ],
);
