"use client";
import { useEffect, useState } from "react";

export default function useIdle(delay = 800) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const run = () => setTimeout(() => setReady(true), delay);
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 1500 });
    } else {
      run();
    }
  }, [delay]);

  return ready;
}