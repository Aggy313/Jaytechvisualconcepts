/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Flame, ShieldAlert, Clock, ArrowUpRight } from "lucide-react";

interface ExitIntentPopupProps {
  onTriggerAudit: () => void;
}

export default function ExitIntentPopup({ onTriggerAudit }: ExitIntentPopupProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Basic mouseout catcher
    const handleMouseLeave = (e: MouseEvent) => {
      if (hasDismissed || showPopup) return;
      // If mouse moves above top of screen
      if (e.clientY < 15) {
        setShowPopup(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasDismissed, showPopup]);

  const handleAction = () => {
    setShowPopup(false);
    onTriggerAudit();
  };

  const handleDismiss = () => {
    setShowPopup(false);
    setHasDismissed(true);
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="bg-[#0E0E0E] border-2 border-[#2563EB]/30 rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl p-8"
          >
            {/* Edge glow */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]" />

            {/* Exit button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold text-xs"
            >
              ✕
            </button>

            {/* Icon Banner */}
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] mb-6">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>

            {/* Content text */}
            <div className="text-left space-y-3">
              <h3 className="text-white text-xl font-bold tracking-tight">
                Don&apos;t Leave Your Visual Brand Behind!
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-normal">
                Businesses utilizing unoptimized, low-speed templates lose 40% of standard cold inquiries. Claim your <span className="text-[#06B6D4] font-bold">Free Visual Brand Auditing Report</span> and turn ideas into pure conversion metrics!
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-6 flex flex-col gap-3">
              <button
                onClick={handleAction}
                className="w-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-bold text-xs uppercase tracking-widest py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <span>Generate Audit Now (60s)</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={handleDismiss}
                className="w-full text-center text-gray-400 hover:text-white text-[11px] font-mono uppercase tracking-wider py-1.5 focus:outline-none"
              >
                No thank you, I prefer generic layouts
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
