import noStoreImage from "@/assets/images/store.png";
import { twMerge } from "tailwind-merge";
import render from "@/shared/ui/render";

interface NoStoreBoxProps {
  type?: "map" | "list";
}

const NoStoreBox = ({ type = "list" }: NoStoreBoxProps) => {
  return (
    <Wrapper>
      <NoStoreImage type={type} />
      <NoStoreTitle type={type}>찾으시는 가게가 없어요</NoStoreTitle>
      <NoStoreDescription type={type}>다른 조건으로 다시 검색해보세요</NoStoreDescription>
    </Wrapper>
  );
};

const Wrapper = render.div("flex flex-col items-center justify-center h-full");

const NoStoreImageBase = render.img();

const NoStoreImage = ({ type }: { type: "map" | "list" }) => {
  return (
    <NoStoreImageBase
      src={noStoreImage}
      className={twMerge(type === "map" ? "mb-8 w-80" : "mb-20 h-70 w-110")}
    />
  );
};

const NoStoreTitleBase = render.div("text-[#414141]");

const NoStoreTitle = ({ type, children }: { children: string; type: "map" | "list" }) => {
  return (
    <NoStoreTitleBase className={twMerge(type === "map" ? "mb-2 font-16-sb" : "mb-12 font-20-sb")}>
      {children}
    </NoStoreTitleBase>
  );
};

const NoStoreDescriptionBase = render.div("text-gray-500");

const NoStoreDescription = ({ type, children }: { children: string; type: "map" | "list" }) => {
  return (
    <NoStoreDescriptionBase className={twMerge(type === "map" ? "font-14-r" : "font-16-r")}>
      {children}
    </NoStoreDescriptionBase>
  );
};

export default NoStoreBox;
