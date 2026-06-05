/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface LogoProps {
  className?: string; // Additional classes for the container
  iconSize?: string;  // Width/height of the icon (e.g. "w-9 h-9")
  orientation?: "horizontal" | "vertical" | "icon";
  hoverScale?: boolean;
}

export default function Logo({
  className = "",
  iconSize = "w-10 h-10",
  orientation = "horizontal",
  hoverScale = true,
}: LogoProps) {
  // Pure SVG representation of the stylized "JT" cyber-monogram
  const svgIcon = (
    <svg
      viewBox="0 0 100 100"
      className={`${iconSize} shrink-0 transition-transform duration-300 ${
        hoverScale ? "group-hover:scale-110" : ""
      }`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Core High-End gradient matched to the uploaded branding */}
        <linearGradient id="jt-metallic-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F2FE" />
          <stop offset="40%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        {/* Underlay dark gradient for modern futuristic depth */}
        <linearGradient id="jt-depth-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
        </linearGradient>
        
        {/* Ambient Glow effect around the emblem */}
        <filter id="cyber-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* BACKGROUND DEPTH & GRADIENT LAYER */}
      <g filter="url(#cyber-glow)">
        {/* Horizontal main bar of T that arches over the logo */}
        <path
          d="M 28 35 L 72 35 C 72 35, 68 40.5, 65 41 C 62 41.5, 34 41.5, 32 41 L 28 35 Z"
          fill="url(#jt-metallic-cyan)"
        />

        {/* Speed indicators/drift-blocks on the top-right of the horizontal bar */}
        {/* Dash 1 */}
        <path
          d="M 77 35 L 83 35 L 80 41 L 74 41 Z"
          fill="url(#jt-metallic-cyan)"
          opacity="0.9"
        />
        {/* Dash 2 */}
        <path
          d="M 86 35 L 90 35 L 88 41 L 84 41 Z"
          fill="url(#jt-metallic-cyan)"
          opacity="0.75"
        />
        {/* Dash 3 (Tiny) */}
        <path
          d="M 93 35 L 95 35 L 94 41 L 92 41 Z"
          fill="url(#jt-metallic-cyan)"
          opacity="0.5"
        />

        {/* Futuristic slanted 'T' core stem */}
        <path
          d="M 52 41 L 52 74 C 52 74, 55 64, 69 52 C 72 49, 75 46.5, 75 46.5 L 59 41.5 Z"
          fill="url(#jt-metallic-cyan)"
        />
        
        {/* Shadow Overlay for extreme tech dimension */}
        <path
          d="M 52 41.5 L 52 64 C 52 64, 53.5 59, 62 52 Z"
          fill="url(#jt-depth-shadow)"
          opacity="0.85"
        />

        {/* Futuristic curved 'J' loop with custom thickness and rounded hook */}
        <path
          d="M 49 46.5 L 49 66 C 49 75, 41 78, 31 78 C 21 78, 17 71, 17 63 L 26 63 C 26 68, 27 71, 31 71 C 35 71, 38 68, 38 63 L 38 46.5 Z"
          fill="url(#jt-metallic-cyan)"
        />
      </g>
    </svg>
  );

  if (orientation === "icon") {
    return svgIcon;
  }

  if (orientation === "vertical") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {svgIcon}
        <span className="text-white font-black text-xl tracking-widest mt-3 uppercase font-sans">
          JAYTECH
        </span>
        <span className="text-[#06B6D4] text-[10px] font-mono tracking-[0.25em] uppercase font-bold mt-1">
          Visual Concepts
        </span>
      </div>
    );
  }

  // Horizontal layout for Navbar & Footer
  return (
    <div className={`flex items-center space-x-3 text-left group ${className}`}>
      {svgIcon}
      <div className="flex flex-col leading-none">
        <span className="text-white font-black text-lg tracking-wide uppercase font-sans">
          JAYTECH
        </span>
        <span className="text-[#06B6D4] text-[9px] font-mono tracking-widest uppercase font-bold mt-0.5">
          Visual Concepts
        </span>
      </div>
    </div>
  );
}
