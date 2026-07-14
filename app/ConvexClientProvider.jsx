"use client";
import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

let convex = null;
function getConvexClient() {
  if (!convex) {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      throw new Error(
        "NEXT_PUBLIC_CONVEX_URL is not set. Run `convex dev` and ensure .env.local is populated."
      );
    }
    convex = new ConvexReactClient(url);
  }
  return convex;
}

const ConvexClientProvider = ({ children }) => {
  return <ConvexProvider client={getConvexClient()}>{children}</ConvexProvider>;
};

export default ConvexClientProvider;
