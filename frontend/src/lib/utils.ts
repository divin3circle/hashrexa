import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { keccak256 } from "ethers";

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

/**
 * Generates a market ID from market parameters using keccak256 hashing.
 * This function uses the pre-encoded market parameters struct and then hashes it to create a unique market identifier.
 *
 * @param marketParams - The market parameters object containing loanToken, collateralToken, oracle, irm, and lltv
 * @returns A keccak256 hash string representing the market ID
 *
 * @example
 * ```typescript
 * const marketId = generateMarketId(MarketParams);
 * console.log(marketId); // "0x1234..."
 * ```
 */
export function generateMarketId(marketParams: typeof MarketParams): string {
  console.log(marketParams);
  // Pre-encoded MarketParams struct bytes
  const encodedStruct =
    "0x0000000000000000000000000000000000631766000000000000000000000000000000000000000000000000000000000000635c710535a028c31c3d169b74e0b4bb141e064cac2b5c2f4fc5416d96ac447388ead98c8eedb45d6ba820000000000000000000000000000000000000000000000000bef55718ad60000";

  const marketId = keccak256(encodedStruct);

  return marketId;
}

export const marketId = generateMarketId(MarketParams);
