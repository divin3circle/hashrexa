import { motion } from "framer-motion";
import React from "react";
import { FaWallet, FaBrain, FaExternalLinkAlt } from "react-icons/fa";
import { RiTokenSwapFill } from "react-icons/ri";
import { MdDashboardCustomize } from "react-icons/md";
import { cn } from "@/lib/utils";

const features = [
  {
    id: 1,
    title: "Seamless Stock Tokenization",
    desc: "Convert stocks to Hedera tokens instantly",
    icon: <FaWallet />,
  },
  {
    id: 2,
    title: "Token Redemption",
    desc: "Redeem tokens back to original stocks anytime",
    icon: <RiTokenSwapFill />,
  },
  {
    id: 3,
    title: "Real-Time Portfolio Tracking",
    desc: "Track all your tokenized assets in real-time",
    icon: <MdDashboardCustomize />,
  },
  {
    id: 4,
    title: "AI-Driven Insights",
    desc: "Get personalized AI investment recommendations",
    icon: <FaBrain />,
  },
];

function Features() {
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
        Features
      </motion.h1>
      <motion.h1
        className="text-2xl md:text-4xl w-full md:w-3/4 font-bold font-ubuntu-sans text-center my-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
      >
        We're offering a seamless tokenization, token redemption and asset
        recovery experience for your stock holdings.
      </motion.h1>
      <motion.p
        className="text-center text-lg font-ubuntu-sans font-light leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
      >
        We envision a decentralized future ecosystem where users can unify their
        traditional assets with their digital assets.
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-4 mt-10">
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2 * feature.id,
              duration: 0.6,
              ease: "easeOut",
            }}
            className={cn(
              " w-[400px] h-[400px] md:w-[250px] md:h-[300px] rounded-2xl bg-gray-100 p-4 relative",
              feature.id === 2 && "bg-[#ff9494]"
            )}
          >
            <div className="text-4xl">{feature.icon}</div>
            <div className="absolute bottom-4 right-0 left-0 px-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 * feature.id,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className={cn(
                  "text-xl md:text-lg text-gray-800 font-bold font-ubuntu-sans",
                  feature.id === 2 && "text-white"
                )}
              >
                {feature.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 * feature.id,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className={cn(
                  "text-md md:text-sm text-gray-500 font-ubuntu-sans font-light mb-2",
                  feature.id === 2 && "text-gray-100"
                )}
              >
                {feature.desc}
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 * feature.id,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className={cn(
                  "bg-[#ff9494] mt-4 text-white px-4 py-2 rounded-lg lowercase text-sm flex items-center gap-2",
                  feature.id === 2 && "bg-gray-100 text-[#ff9494]"
                )}
              >
                Learn More
                <FaExternalLinkAlt />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Features;
