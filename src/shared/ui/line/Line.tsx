import { twMerge } from "tailwind-merge";
import render from "@/shared/ui/render";

interface LineProps {
  vertical?: boolean;
  className?: string;
}

const LineElement = render.div();

export const Line = ({ vertical, className }: LineProps) => (
  <LineElement
    className={twMerge(vertical ? "w-1 min-w-1 h-full" : "w-full h-1 min-h-1", "bg-divider", className ?? "")}
  />
);
