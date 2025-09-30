"use client";

import { useEffect } from "react";

export default function AnimationHead() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/animation.css";
    link.media = "print";
    link.onload = () => { link.media = "all"; };
    document.head.appendChild(link);
  }, []);

  return null;
}
