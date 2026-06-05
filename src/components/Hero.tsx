/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowUpRight, Play, Star, ShieldCheck, Trophy, Target, Award } from "lucide-react";

interface HeroProps {
  onNavigate: (section: string) => void;
  onOpenAuth: (view: "login" | "register") => void;
}

export default function Hero({ onNavigate, onOpenAuth }: HeroProps) {
  // Stats
  const metrics = [
    { value: "150+", label: "Brands Scaled Globally", icon: Target, color: "text-[#2563EB]" },
    { value: "$24M+", label: "Client Equity Raised", icon: Trophy, color: "text-amber-500" },
    { value: "98.9%", label: "Conversion Index", icon: ShieldCheck, color: "text-[#06B6D4]" },
    { value: "12+", label: "Agency Design Honors", icon: Award, color: "text-purple-500" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-[#EEF2F6] via-white to-[#EEF2F6] text-slate-800"
    >
      {/* Background Gradients & Ambient Circles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] bg-[#2563EB]/10 rounded-full blur-[110px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] bg-sky-400/8 rounded-full blur-[130px]" />
        {/* Sleek Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.015)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Mini Award Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-blue-700">
            Now Booking Q3 Strategic Overhauls
          </span>
        </motion.div>

        {/* Brand Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-slate-950 text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mb-6 max-w-4xl mx-auto"
        >
          Turning Ideas <br />
          Into{" "}
          <span className="bg-gradient-to-r from-[#2563EB] to-[#0A84FF] bg-clip-text text-transparent italic">
            Visual Power
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-slate-650 text-sm sm:text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto mb-10"
        >
          We engineer high-fidelity brand ecosystems, fast digital interfaces, and cinematic visual assets that command premium market value, eliminate user friction, and elevate consumer conversion metrics.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <button
            onClick={() => onNavigate("audit")}
            className="w-full sm:w-auto bg-gradient-to-r from-[#2563EB] to-[#0A84FF] hover:from-blue-700 hover:to-blue-600 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full flex items-center justify-center space-x-2 shadow-xl shadow-blue-500/25 group transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Run Free Brand Audit</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
          <button
            onClick={() => onNavigate("portfolio")}
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-full border border-slate-200 flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
          >
            <span>View Agency Case Studies</span>
          </button>
        </motion.div>

        {/* Client Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="border-t border-b border-slate-200 py-6 mb-24 flex flex-col items-center justify-center"
        >
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-4 font-semibold">
            Honored and Cited On
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-xs font-mono font-bold text-slate-600">
            <span>AWWWARDS</span>
            <span>FITC DIGITAL</span>
            <span>BEHANCE PRO</span>
            <span>STRIPE VENTURES</span>
            <span>LINEAR LABS</span>
            <span>APPLE PARTNERS</span>
          </div>
        </motion.div>

        {/* Conversion Performance Bento Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-blue-100/80 hover:border-blue-300 transition-all p-6 rounded-2xl text-left shadow-sm hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-0.5 relative overflow-hidden group"
            >
              {/* Subtle top decoration */}
              <div className="absolute top-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#2563EB] to-transparent" />
              <div className="flex items-center justify-between mb-3">
                <m.icon className={`w-6 h-6 ${m.color}`} />
                <div className="flex items-center space-x-0.5 text-amber-500">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span className="text-[9px] font-mono font-bold">5.0</span>
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 leading-none tracking-tight mb-1">
                {m.value}
              </div>
              <div className="text-slate-500 text-xs tracking-tight font-medium">
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
