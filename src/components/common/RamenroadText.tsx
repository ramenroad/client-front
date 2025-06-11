import styled from "@emotion/styled";
import { ComponentProps } from "react";
import tw from "twin.macro";

interface TextProps extends ComponentProps<"span"> {
  children: React.ReactNode;
  size: 10 | 12 | 14 | 16 | 18 | 20 | 22;
  weight: "r" | "m" | "sb";
}

const fontClassMap = {
  "10-r": tw`font-10-r`,
  "10-m": tw`font-10-m`,
  "10-sb": tw`font-10-sb`,
  "12-r": tw`font-12-r`,
  "12-m": tw`font-12-m`,
  "12-sb": tw`font-12-sb`,
  "14-r": tw`font-14-r`,
  "14-m": tw`font-14-m`,
  "14-sb": tw`font-14-sb`,
  "16-r": tw`font-16-r`,
  "16-m": tw`font-16-m`,
  "16-sb": tw`font-16-sb`,
  "18-r": tw`font-18-r`,
  "18-m": tw`font-18-m`,
  "18-sb": tw`font-18-sb`,
  "20-r": tw`font-20-r`,
  "20-m": tw`font-20-m`,
  "20-sb": tw`font-20-sb`,
  "22-r": tw`font-22-r`,
  "22-m": tw`font-22-m`,
  "22-sb": tw`font-22-sb`,
};

export const RamenroadText = (props: TextProps) => {
  const { children, size, weight, ...rest } = props;
  return (
    <Text size={size} weight={weight} {...rest}>
      {children}
    </Text>
  );
};

const Text = styled.span<{
  size: 10 | 12 | 14 | 16 | 18 | 20 | 22;
  weight: "r" | "m" | "sb";
}>(({ size, weight }) => fontClassMap[`${size}-${weight}`]);
