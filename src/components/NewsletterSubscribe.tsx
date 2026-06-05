/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowRight, Check, Loader } from "lucide-react";
import { api } from "../lib/api";

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError(null);
    setLoading(true);

    try {
      await api.subscribeNewsletter(email.trim());
      setSuccess(true);
      setEmail("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setError("Unable to save subscription. Please try a different email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="newsletter-subscription-box" className="w-full">
      <h4 className="text-white text-xs uppercase font-mono font-bold tracking-widest mb-3">
        Intelligence Channel
      </h4>
      <p className="text-gray-500 text-xs mb-4 leading-relaxed font-normal">
        Get premium design analysis, code architecture parameters, and strategic blueprint advice.
      </p>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3.5 rounded-xl font-normal"
          >
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Subscribed successfully in database.</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                disabled={loading}
                placeholder="strategist@brand.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.01] border border-white/10 hover:border-white/15 focus:border-[#06B6D4] text-white placeholder-gray-600 rounded-xl py-3.5 pl-10 pr-12 text-xs font-normal focus:outline-none transition-all focus:ring-1 focus:ring-[#06B6D4]/30"
              />
              <button
                type="submit"
                disabled={loading || !email}
                className="absolute inset-y-1.5 right-1.5 w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition cursor-pointer disabled:opacity-35 shrink-0"
                title="Subscribe to Bulletin"
              >
                {loading ? (
                  <Loader className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {error && (
              <p className="text-rose-400 text-[10px] font-mono leading-relaxed">
                {error}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
