import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PUBLIC_KEY =
  "302a300506032b65700321004a951af7c45e06153abd80004e44df9ba5fffca54984f9dcccc8445c0674f613";
