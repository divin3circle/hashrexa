import { motion } from "framer-motion";
import { FaGithub, FaDiscord, FaTwitter } from "react-icons/fa6";
import footer from "../../../../public/footer.png";
import graphs from "../../../../public/stocks.json";
import Lottie from "lottie-react";
import ConnectButton from "@/components/ui/ConnectButton";

const socials = [
  {
    name: "twitter",
    url: "https://twitter.com/hashrexa",
    icon: <FaTwitter />,
  },
  {
    name: "github",
    url: "https://twitter.com/hashrexa",
    icon: <FaGithub />,
  },
  {
    name: "discord",
    url: "https://twitter.com/hashrexa",
    icon: <FaDiscord />,
  },
];

function Footer() {
  return (
    <div className="flex flex-col md:flex-row items-center mt-16 rounded-4xl bg-gray-100 w-full md:h-[300px] mb-4 border border-gray-300">
      <div className="flex flex-col gap-2 md:w-1/4 p-2 md:border-r border-gray-300">
        <motion.h1
          className="text-md font-bold font-ubuntu-sans text-center rounded-2xl py-1 px-4 border border-primary w-fit my-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          Let's Start Now
        </motion.h1>
        <motion.p
          className="text-start text-xl font-ubuntu-sans font-semibold leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
        >
          Join the Future of Assets Management Today!
        </motion.p>
        <div className="my-4 flex items-center justify-center w-full">
          <ConnectButton />
        </div>
      </div>
      <div className="flex relative flex-col md:flex-row gap-2 w-full md:w-3/4 bg-[#ff9494] h-full rounded-b-4xl md:rounded-r-4xl md:rounded-bl-none">
        <img
          src={footer}
          alt="footer"
          width={500}
          height={500}
          className="border-t border-b border-gray-100"
        />
        <Lottie animationData={graphs} loop={true} className="w-full h-full" />
        <div className="absolute bottom-2 right-10 flex flex-row gap-8">
          {socials.map((social) => (
            <a
              href={social.url}
              key={social.name}
              className="flex flex-col group items-center justify-center text-white text-2xl transition-all duration-300 group-hover:text-primary"
            >
              {social.icon}
              <span className="text-xs font-ubuntu-sans font-light group-hover:text-primary transition-all duration-300">
                {social.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Footer;
