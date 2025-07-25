import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import logo from "@/public/logo-transaparent.png";

function Navbar() {
  return (
    <div className="flex items-center justify-between mt-4">
      <h1 className="text-2xl font-bold font-mono">hashrexa.</h1>
      <button className="bg-primary text-white font-mono font-semibold text-md rounded-xl px-4 py-1.5 lowercase">
        Get Started
      </button>
    </div>
  );
}

export default Navbar;
