import React from "react";
import tw from "twin.macro";
import styled from "@emotion/styled";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled,
}) => {
  return (
    <ToggleLabel disabled={disabled}>
      <ToggleInput
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <Slider checked={checked} />
    </ToggleLabel>
  );
};

const ToggleLabel = styled.label<{ disabled?: boolean }>(({ disabled }) => [
  tw`
      relative inline-block w-40 h-22
      rounded-full cursor-pointer transition-all
      bg-gray-200
    `,
  disabled && tw`opacity-50 cursor-not-allowed`,
]);

const ToggleInput = tw.input`
  opacity-0 w-0 h-0 absolute
`;

const Slider = styled.span<{ checked: boolean }>(({ checked }) => [
  tw`
    absolute top-0 left-0 w-40 h-22 rounded-full transition-all duration-200
    bg-orange
  `,
  !checked && tw`bg-gray-200`,
  {
    "::before": {
      content: '""',
      position: "absolute",
      left: checked ? "20px" : "2px",
      top: "2px",
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      background: "#fff",
      transition: "left 0.2s",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    },
  },
]);
