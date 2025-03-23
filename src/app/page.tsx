import Image from "next/image";
"use client"

import * as React from "react"

import { ModeToggle } from "@/components/ui/ModeToggle";
import HeroSection from "@/components/ui/HeroSection";
import HeroContinue from "@/components/ui/HeroContinue";
import Problems from "@/components/ui/Problems";
import Features from "@/components/ui/Features";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";



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







