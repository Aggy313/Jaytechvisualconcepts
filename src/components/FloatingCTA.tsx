/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { MessageSquare, ArrowUp, Zap, HelpCircle } from "lucide-react";

export default function FloatingCTA() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openWhatsApp = () => {
    // Direct WhatsApp anchor linking to agency strategist profile
    const text = encodeURIComponent("Hello JayTech Visual Concepts! I would like to inquire about a premium design overhaul.");
    window.open(`https://wa.me/254758743069?text=${text}`, "_blank");
  };

  return (
    <div id="floating_cta_panel" className="fixed bottom-6 right-6 z-40 flex flex-col items-center space-y-3">
      {/* WhatsApp Floating Button */}
      <button
        onClick={openWhatsApp}
        className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 hover:scale-105 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/10 cursor-pointer group transition-all"
        title="Direct Strategist WhatsApp"
      >
        <MessageSquare className="w-5 h-5 transition-transform group-hover:rotate-12" />
      </button>

      {/* Floating Action consultation shortcut */}
      <a
        href="#audit"
        className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-[10px] font-bold uppercase tracking-widest py-2.5 px-4 rounded-full shadow-lg h-10 hover:scale-105 transition-transform"
      >
        <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>Free Audit</span>
      </a>

      {/* Back to top scroll button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-10 h-10 bg-[#0A0A0A]/90 border border-white/10 hover:bg-white/10 text-white rounded-full flex items-center justify-center shadow-md focus:outline-none cursor-pointer hover:border-white/20 transition-all"
          title="Scroll To Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
