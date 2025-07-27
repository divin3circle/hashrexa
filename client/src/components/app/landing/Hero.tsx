import hedera from "../../../../public/hedera.png";
import alpaca from "../../../../public/alpaca.png";
import graphs from "../../../../public/stocks.json";
import Lottie from "lottie-react";
import { FaFireFlameCurved } from "react-icons/fa6";

import { motion } from "framer-motion";
import { TextGenerateEffect } from "../../../components/ui/text-generate-effect";

const words = `Bringing the world closer to the blockchain via decentralized finance`;

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center md:h-screen gap-10">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center mt-10"
      >
        <h1 className="text-4xl font-bold font-ubuntu-sans text-center">
          Welcome to Hashrexa
        </h1>
        <TextGenerateEffect words={words} className="text-primary" />
      </motion.section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center md:flex-row md:justify-between gap-2 "
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-[2rem] p-4 w-full  md:w-full h-[450px] bg-gray-100 relative hover:shadow-sm shadow-[#FF9494] transition-all duration-500"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl font-bold font-ubuntu-sans mt-10"
          >
            The <span className="text-primary">best</span> way to{" "}
            <span className="text-primary">spend</span> your{" "}
            <span className="text-primary">stocks on the blockchain</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-500 leading-relaxed my-8"
          >
            Hashrexa Tokenizes stocks for use in DeFi, NFT marketplaces, or
            other Web3 applications.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-[#FF9494] text-white font-mono font-semibold text-md rounded-xl px-4 py-1.5 lowercase"
          >
            Get Started
          </motion.button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex items-center gap-2 mt-10"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={hedera}
                alt="hedera"
                width={120}
                height={100}
                className="border border-gray-200 rounded-full py-1.5 px-4 "
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={alpaca}
                alt="alpaca"
                width={120}
                height={100}
                className="border border-gray-200 rounded-full py-1.5 px-4 "
              />
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="rounded-[2rem] p-4 w-full md:w-full  h-[450px] bg-[#FF9494] relative"
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between absolute top-1/6 z-40 left-2.5 backdrop-blur-lg bg-white/30 rounded-2xl w-2/3 md:w-1/2 p-4"
          >
            <div className="">
              <h1 className="font-semibold text-xs">My Portfolio</h1>
              <p className="text-3xl font-mono">$44,789.09</p>
              <p className="text-gray-500 text-sm">approx: 44.54 AAPL</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="flex flex-col items-center gap-2"
            >
              <FaFireFlameCurved className="text-primary text-2xl" size={34} />
              <p className="text-sm font-mono text-gray-500">+2.78%</p>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between absolute bottom-1/6 z-40 right-2.5 backdrop-blur-lg bg-white/30 rounded-2xl w-2/3 md:w-1/2 p-4"
          >
            <div className="">
              <h1 className="font-semibold text-xs">notification</h1>
              <p className="text-sm font-mono">
                You have minted $150 worth of on-chain AAPL stocks.
              </p>
              <p className="text-gray-500 text-sm">04:54 am today</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <Lottie
              animationData={graphs}
              loop={true}
              className="w-full h-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Hero;
