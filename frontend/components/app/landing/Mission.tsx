"use client";

import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import mission1 from "@/public/mission1.json";
import mission2 from "@/public/wallets.json";

function Mission() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center mt-16 rounded-4xl md:h-screen"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.h1
        className="text-md font-bold font-ubuntu-sans text-center rounded-2xl py-1 px-4 border border-primary my-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      >
        Our Mission
      </motion.h1>
      <motion.h1
        className="text-2xl md:text-4xl w-full md:w-1/2 font-bold font-ubuntu-sans text-center my-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
      >
        We provide a secure, intuitive, and user-friendly platform.
      </motion.h1>
      <motion.p
        className="text-center text-lg font-ubuntu-sans font-light leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
      >
        We believe in the power of decentralized finance to transform the way
        people interact with money and financial services.
      </motion.p>
      <motion.div className="flex flex-col-reverse md:flex-row items-center justify-center md:gap-12 mt-12 p-2">
        <Lottie
          animationData={mission1}
          loop={true}
          className="w-[400px] h-[400px]"
        />
        <div className="flex flex-col items-start gap-4 justify-start w-full md:w-1/2">
          <motion.h1
            className="text-md font-bold font-ubuntu-sans text-center rounded-2xl py-1 px-4 border border-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            Unlocking Potential
          </motion.h1>
          <motion.h1
            className="text-2xl font-bold font-ubuntu-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            Web3 Gateway for Traditional Assets
          </motion.h1>
          <motion.p
            className="text-md my-2 text-lg font-ubuntu-sans font-light leading-relaxed md:w-3/4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          >
            Hashrexa is dedicated to revolutionizing asset ownership by enabling
            users to tokenize their stock holdings into Hedera-based tokens,
            unlocking the potential of Web3 ecosystems.
          </motion.p>
        </div>
      </motion.div>
      <motion.div className="flex flex-col md:flex-row items-center justify-center md:gap-12 mt-12 p-2">
        <div className="flex flex-col items-start gap-4 justify-start w-full md:w-1/2">
          <motion.h1
            className="text-md font-light font-ubuntu-sans text-center rounded-2xl py-1 px-4 border border-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            User Centric
          </motion.h1>
          <motion.h1
            className="text-2xl font-bold font-ubuntu-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            Fast and Low Cost Transactions
          </motion.h1>

          <motion.p
            className="text-md my-2 text-lg font-ubuntu-sans font-light leading-relaxed md:w-3/4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          >
            By integrating Alpaca’s global brokerage with Hedera’s secure,
            high-performance blockchain, we provide a transparent, and
            user-centric platform where investors can participate in DeFi while
            retaining control over their traditional assets.
          </motion.p>
        </div>
        <Lottie
          animationData={mission2}
          loop={true}
          className="w-[400px] h-[400px]"
        />
      </motion.div>
    </motion.div>
  );
}

export default Mission;
