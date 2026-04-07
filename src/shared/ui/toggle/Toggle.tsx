import React from "react";
import styled from "@emotion/styled";
import render from "@/shared/ui/render";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  onText?: string;
  offText?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled, onText, offText }) => {
  return (
    <ToggleLabel disabled={disabled}>
      <ToggleInput
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
      />
      <Slider checked={checked} />
      <ToggleText checked={checked}>{checked ? onText : offText}</ToggleText>
    </ToggleLabel>
  );
};

const ToggleText = styled.span<{ checked: boolean }>(({ checked }) => [
  {
    position: "absolute",
    fontSize: "8px",
    lineHeight: "12px",
    color: "#ffffff",
  },
  checked ? { left: "4px" } : { right: "4px" },
  {
    top: "50%",
    transform: "translateY(-50%)",
  },
]);

const ToggleLabel = styled.label<{ disabled?: boolean }>(({ disabled }) => [
  {
    position: "relative",
    display: "inline-block",
    width: "40px",
    height: "22px",
    borderRadius: "9999px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: "#cfcfcf",
  },
  disabled && {
    opacity: 0.5,
    cursor: "not-allowed",
  },
]);

const ToggleInput = render.input("opacity-0 w-0 h-0 absolute");

const Slider = styled.span<{ checked: boolean }>(({ checked }) => [
  {
    position: "absolute",
    top: 0,
    left: 0,
    width: "40px",
    height: "22px",
    borderRadius: "9999px",
    transition: "all 0.2s ease",
    backgroundColor: "#ff5e00",
  },
  !checked && {
    backgroundColor: "#cfcfcf",
  },
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
