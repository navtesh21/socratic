"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

import React from "react";

function TenstackQuery({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <div>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </div>
  );
}

export default TenstackQuery;
