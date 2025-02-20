import Image from "next/image";
"use client"

import * as React from "react"

import { ModeToggle } from "@/components/ui/ModeToggle";
import HeroSection from "@/components/ui/HeroSection";
import HeroContinue from "@/components/ui/HeroContinue";
import Problems from "@/components/ui/Problems";
import Features from "@/components/ui/Features";


export default function Home() {
  return (
    <div className="">
      <div className="mt-[52px]">
      <HeroSection/>
      </div>
      {/* Features */}
      <div>
        <Features />
      </div>
      <div className=" flex justify-center">
        <Problems/>
      </div>
      <div>
        
      </div>
    </div>
  );
}







