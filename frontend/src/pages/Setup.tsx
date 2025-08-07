import { Button } from "@/components/ui/button";
import { useTopicManager } from "@/hooks/useTopicManager";
import Lottie from "lottie-react";
import { FaInfoCircle } from "react-icons/fa";
import createTopicAnimation from "../../public/write.json";
import { FaLink, FaMinus, FaPlus, FaSpinner } from "react-icons/fa6";
import { useState } from "react";
import { motion } from "framer-motion";

function Setup() {
  const [showTopicModal, setShowTopicModal] = useState(false);
  const { createTopicMutation, isPending, isAssociatePending } =
    useTopicManager();

  return (
    <div className="max-w-6xl mx-auto px-2 flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col gap-2 max-w-md mx-auto">
        <h1 className="text-2xl font-ubuntu-sans font-semibold text-start md:text-center">
          Welcome to Hashrexa
        </h1>
        <p className="text-base text-gray-500 text-start md:text-center">
          Create a new topic to get started
        </p>
        <Lottie animationData={createTopicAnimation} loop={true} />
        <Button onClick={() => createTopicMutation()} className="rounded-full">
          {isPending || isAssociatePending ? (
            <FaSpinner className="animate-spin" />
          ) : (
            "Create Topic"
          )}
        </Button>
        <p className="text-xs text-gray-500 text-start md:text-center">
          A topic is a collection of messages that are stored on the Hedera
          network.
        </p>
        <div className="flex flex-col w-full border-t border-b border-gray-300 mt-6 p-2 py-4 transition-all duration-300">
          <motion.div
            className="flex items-center justify-between w-full transition-all duration-300"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-base font-semibold text-primary text-start flex items-center gap-0.5">
              <FaInfoCircle className="text-[#ff9494]" />
              Why do I need a topic?
            </h1>
            {showTopicModal ? (
              <FaMinus
                onClick={() => setShowTopicModal(false)}
                className="cursor-pointer"
              />
            ) : (
              <FaPlus
                onClick={() => setShowTopicModal(true)}
                className="cursor-pointer"
              />
            )}
          </motion.div>
          {showTopicModal && (
            <motion.div
              className="flex flex-col gap-2 mt-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm text-gray-500 text-start">
                Each authenticated user has a unique topic which they can submit
                profile changes or trade actions to for permanent verifiable and
                immutable storage.
              </p>
              <p className="text-sm text-gray-500 text-start">
                A create topic transaction is only signed once.
              </p>
              <a
                href="https://docs.hedera.com/hedera/getting-started-hedera-native-developers/create-a-topic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 flex items-center gap-1 text-start"
              >
                Learn more <FaLink />
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Setup;
