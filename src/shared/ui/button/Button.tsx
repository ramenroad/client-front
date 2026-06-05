import type { ComponentProps } from "react";
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
        "w-full h-48 bg-orange text-on-brand shadow-none font-16-sb rounded-8 border-none py-12 cursor-pointer",
        variant === "primary" ? "bg-orange text-on-brand border-muted" : "",
        variant === "secondary" ? "bg-surface text-secondary border border-solid border-muted" : "",
        variant === "gray" ? "bg-surface-muted text-primary" : "",
        variant === "gray-outline" ? "bg-transparent text-muted border border-solid border-outline-muted" : "",
        props.disabled ? "bg-disabled cursor-not-allowed text-muted" : "",
        props.className ?? "",
      )}
    />
  );
};

const ButtonWrapper = render.button();
