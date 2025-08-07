import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PUBLIC_KEY =
  "302a300506032b65700321004a951af7c45e06153abd80004e44df9ba5fffca54984f9dcccc8445c0674f613";

export const MarketParams = {
  loanToken: "0x0000000000000000000000000000000000631766",
  collateralToken: "0x00000000000000000000000000000000006353C7",
  oracle: "0x10535a028c31C3d169B74E0B4bb141e064cAc2B5",
  irm: "0xC2f4fc5416d96ac447388EAD98c8eeDb45d6Ba82",
  lltv: "860000000000000000",
};
