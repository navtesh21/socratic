"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Home } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

interface ImageDialogProps {
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  title: string;
  description: string;
  isOpen: boolean;
}

export default function ImageDialog({
  image,
  title,
  description,
  isOpen,
}: ImageDialogProps) {



  return (
    <Dialog open={isOpen}>
      <DialogContent className="gap-0 p-0 [&>button:last-child]:text-white">
        <div className="p-2">
          <Image
            className="w-full rounded-lg"
            src={image.src || "https://originui.com/dialog-content.pngg"}
            width={image.width}
            height={image.height}
            alt={image.alt}
          />
        </div>
        <div className="space-y-6 px-6 pb-6 pt-3">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
           
           <Link href="/" target="_blank">
            <Button
              className="group"
              type="button"
             
            >
              Home
              <Home
                className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </Button>
            </Link>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
