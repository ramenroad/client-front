import { ComponentProps } from "react";
import render from "@/shared/ui/render";

export const ReviewImage = (props: ComponentProps<"img">) => {
  return <Image {...props} />;
};

const Image = render.img("w-full h-full object-cover cursor-pointer");
