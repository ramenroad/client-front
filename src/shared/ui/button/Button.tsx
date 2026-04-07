import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import render from "@/shared/ui/render";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "gray" | "gray-outline";
}

export const Button = ({ variant = "primary", ...props }: ButtonProps) => {
  return (
    <ButtonWrapper
      {...props}
      className={twMerge(
        "w-full h-48 bg-orange text-white shadow-none font-16-sb rounded-[8px] border-none py-12 cursor-pointer",
        variant === "primary" ? "bg-orange text-white border-gray-500" : "",
        variant === "secondary" ? "bg-white text-gray-700 border border-solid border-gray-500" : "",
        variant === "gray" ? "bg-border text-gray-900" : "",
        variant === "gray-outline" ? "bg-transparent text-gray-500 border border-solid border-border" : "",
        props.disabled ? "bg-gray-200 cursor-not-allowed" : "",
        props.className ?? "",
      )}
    />
  );
};

const ButtonWrapper = render.button();
