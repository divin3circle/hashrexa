"use client";

import React from "react";
import hedera from "@/public/hedera.png";
import alpaca from "@/public/alpaca.png";
import graphs from "@/public/stocks.json";
import { FaFireFlameCurved } from "react-icons/fa6";
import Image from "next/image";
import Lottie from "lottie-react";

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center mt-10 md:flex-row md:justify-between gap-2">
      <div className="rounded-[2rem] p-4 w-full md:w-1/2  h-[450px] bg-gray-100 relative">
        <h1 className="text-4xl font-bold font-ubuntu-sans mt-10">
          The <span className="text-primary">best</span> way to{" "}
          <span className="text-primary">spend</span> your{" "}
          <span className="text-primary">stocks on the blockchain</span>
        </h1>
        <p className="text-gray-500 leading-relaxed my-8">
          Hashrexa Tokenizes stocks for use in DeFi, NFT marketplaces, or other
          Web3 applications.
        </p>
        <button className="bg-[#FF9494] text-white font-mono font-semibold text-md rounded-xl px-4 py-1.5 lowercase">
          Get Started
        </button>
        <div className="flex items-center gap-2 mt-10">
          <Image
            src={hedera}
            alt="hedera"
            width={120}
            height={100}
            className="border border-gray-200 rounded-full py-1.5 px-4 "
          />
          <Image
            src={alpaca}
            alt="alpaca"
            width={120}
            height={100}
            className="border border-gray-200 rounded-full py-1.5 px-4 "
          />
        </div>
      </div>
      <div className="rounded-[2rem] p-4 w-full md:w-1/2  h-[450px] bg-[#FF9494] relative">
        <div className="flex items-center justify-between absolute top-1/6 z-40 left-2.5 backdrop-blur-lg bg-white/30 rounded-2xl w-2/3 md:w-1/2 p-4">
          <div className="">
            <h1 className="font-semibold text-xs">My Portfolio</h1>
            <p className="text-3xl font-mono">$44,789.09</p>
            <p className="text-gray-500 text-sm">approx: 44.54 AAPL</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FaFireFlameCurved className="text-primary text-2xl" size={34} />
            <p className="text-sm font-mono text-gray-500">+2.78%</p>
          </div>
        </div>
        <div className="flex items-center justify-between absolute bottom-1/6 z-40 right-2.5 backdrop-blur-lg bg-white/30 rounded-2xl w-2/3 md:w-1/2 p-4">
          <div className="">
            <h1 className="font-semibold text-xs">notification</h1>
            <p className="text-sm font-mono">
              You have minted $150 worth of on-chain AAPL stocks.
            </p>
            <p className="text-gray-500 text-sm">04:54 am today</p>
          </div>
        </div>
        <Lottie animationData={graphs} loop={true} className="w-full h-full" />
      </div>
    </div>
  );
}

export default Hero;
