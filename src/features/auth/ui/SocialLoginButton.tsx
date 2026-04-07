import { type ComponentProps, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import render from "@/shared/ui/render";

export type SocialLoginProvider = "kakao" | "naver" | "google";

interface SocialLoginButtonProps extends ComponentProps<"button"> {
  icon: ReactNode;
  provider: SocialLoginProvider;
}

const providerClassNameMap: Record<SocialLoginProvider, string> = {
  kakao: "bg-[#fee500] text-[rgba(17,17,17,0.85)]",
  naver: "bg-[#03c75a] text-white",
  google: "border border-solid border-[#cfcfcf] bg-white text-black",
};

export const SocialLoginButton = ({ className, icon, provider, children, ...props }: SocialLoginButtonProps) => {
  return (
    <ButtonRoot
      {...props}
      className={twMerge(
        "flex h-46 w-310 items-center justify-center gap-8 rounded-[50px] border-none shadow-none outline-none cursor-pointer font-18-m",
        providerClassNameMap[provider],
        className ?? "",
      )}
    >
      <IconSlot>{icon}</IconSlot>
      <Label>{children}</Label>
    </ButtonRoot>
  );
};

const ButtonRoot = render.button();

const IconSlot = render.span("flex items-center justify-center");

const Label = render.span("leading-27");
