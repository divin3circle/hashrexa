import Hero from "@/components/app/Hero";
import Navbar from "@/components/app/landing/Navbar";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-2">
      <Navbar />
      <Hero />
    </div>
  );
}
