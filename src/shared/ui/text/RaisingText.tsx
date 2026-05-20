import type { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import render from "@/shared/ui/render";

interface TextProps extends ComponentProps<"span"> {
  children: ReactNode;
  size: 10 | 12 | 14 | 16 | 18 | 20 | 22;
  weight: "r" | "m" | "sb" | "b";
}

const fontClassMap = {
  "10-r": "font-10-r",
  "10-m": "font-10-m",
  "10-sb": "font-10-sb",
  "10-b": "font-10-b",
  "12-r": "font-12-r",
  "12-m": "font-12-m",
  "12-sb": "font-12-sb",
  "12-b": "font-12-b",
  "14-r": "font-14-r",
  "14-m": "font-14-m",
  "14-sb": "font-14-sb",
  "14-b": "font-14-b",
  "16-r": "font-16-r",
  "16-m": "font-16-m",
  "16-sb": "font-16-sb",
  "16-b": "font-16-b",
  "18-r": "font-18-r",
  "18-m": "font-18-m",
  "18-sb": "font-18-sb",
  "18-b": "font-18-b",
  "20-r": "font-20-r",
  "20-m": "font-20-m",
  "20-sb": "font-20-sb",
  "20-b": "font-20-b",
  "22-r": "font-22-r",
  "22-m": "font-22-m",
  "22-sb": "font-22-sb",
  "22-b": "font-22-b",
};

const Text = render.span();

export const RaisingText = ({ children, size, weight, ...rest }: TextProps) => {
  return (
    <Text {...rest} className={twMerge(fontClassMap[`${size}-${weight}`], rest.className ?? "")}>
      {children}
    </Text>
  );
};
