"use client";

import Hero from "@/components/app/landing/Hero";
import Features from "@/components/app/landing/Features";
import Mission from "@/components/app/landing/Mission";
import Navbar from "@/components/app/landing/Navbar";
import CTA from "@/components/app/landing/CTA";
import Footer from "@/components/app/landing/Footer";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-2">
      <Navbar />
      <Hero />
      <Mission />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}
