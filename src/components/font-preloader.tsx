"use client";

import { useEffect } from "react";
import { useFont } from "~/contexts/font-context";

export function FontPreloader() {
  const { currentFont } = useFont();

  useEffect(() => {
    // Remove existing preload links
    const existingLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
    existingLinks.forEach(link => {
      if (link.getAttribute('href')?.includes('/fonts/')) {
        link.remove();
      }
    });

    // Preload the current font (skip scheherazade as it's from Google Fonts)
    if (currentFont !== "scheherazade") {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = `/fonts/${currentFont}.ttf`;
      link.as = "font";
      link.type = "font/ttf";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }
  }, [currentFont]);

  return null;
}