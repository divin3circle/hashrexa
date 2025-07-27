import { motion } from "framer-motion";
import cta from "../../../../public/cta.json";
import Lottie from "lottie-react";
import { cn } from "../../../lib/utils";
import { FaExternalLinkAlt } from "react-icons/fa";

function CTA() {
  return (
    <div className="flex flex-col items-center justify-center mt-16 rounded-4xl md:h-screen">
      <motion.h1
        className="text-md font-bold font-ubuntu-sans text-center rounded-2xl py-1 px-4 border border-primary my-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      >
        Start Today
      </motion.h1>
      <motion.h1
        className="text-2xl md:text-4xl w-full md:w-3/4 font-bold font-ubuntu-sans text-center my-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
      >
        Start your journey to the future of finance today.
      </motion.h1>
      <motion.p
        className="text-center text-lg font-ubuntu-sans font-light leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
      >
        Create a free account and start spending your assets on the world's
        cleanest and cheapest blockchain.
      </motion.p>

      <motion.div
        className="flex flex-col md:flex-row items-center justify-between mt-16 rounded-4xl gap-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex flex-col gap-2">
          <motion.h1
            className="text-md font-bold font-ubuntu-sans text-center rounded-2xl py-1 px-4 border border-primary w-fit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            Ready to get started?
          </motion.h1>
          <motion.p
            className="text-start md:w-xl text-lg font-ubuntu-sans font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          >
            Create an account and start spending your assets on the world's
            cleanest and cheapest blockchain.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.6,
              ease: "easeOut",
            }}
            className={cn(
              "bg-[#ff9494] mt-4 text-white px-4 py-2 rounded-lg lowercase text-sm flex items-center gap-2 w-fit"
            )}
          >
            Get Started
            <FaExternalLinkAlt />
          </motion.button>
        </div>
        <Lottie
          animationData={cta}
          loop={true}
          className="w-[400px] h-[400px]"
        />
      </motion.div>
    </div>
  );
}

export default CTA;
