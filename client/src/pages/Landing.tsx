"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/app/landing/Navbar";
import Hero from "@/components/app/landing/Hero";
import Mission from "@/components/app/landing/Mission";
import Features from "@/components/app/landing/Features";
import CTA from "@/components/app/landing/CTA";
import Footer from "@/components/app/landing/Footer";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-2">
      <Navbar />

      {/* Hero Section */}
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Hero />
      </motion.div>

      {/* Mission Section */}
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Mission />
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Features />
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <CTA />
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}
