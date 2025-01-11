"use client";
import { ClerkProvider } from "@clerk/nextjs";

import React from "react";

function ClerkClient({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ClerkProvider>{children}</ClerkProvider>
    </div>
  );
}

export default ClerkClient;
