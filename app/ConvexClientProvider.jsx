"use client";
import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

let convex = null;
/**
 * Lazily initializes and returns a singleton ConvexReactClient instance.
 * Defers creation until first call to avoid SSG/prerendering failures
 * when the NEXT_PUBLIC_CONVEX_URL environment variable is unavailable.
 * @returns {ConvexReactClient} The shared Convex client instance.
 * @throws {Error} If NEXT_PUBLIC_CONVEX_URL is not set.
 */
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

/**
 * Provides the Convex client context to all child components.
 * @param {{ children: React.ReactNode }} props - Component props.
 * @returns {JSX.Element} The wrapped children with ConvexProvider.
 */
const ConvexClientProvider = ({ children }) => {
  return <ConvexProvider client={getConvexClient()}>{children}</ConvexProvider>;
};

export default ConvexClientProvider;
