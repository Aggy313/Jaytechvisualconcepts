/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Cpu, ArrowUpRight, Check, AlertCircle, RefreshCw, BarChart2, Zap } from "lucide-react";
import { api } from "../lib/api";

export default function LeadGen() {
  // Input fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    brandUrl: "",
    industry: "",
    goals: "",
    audience: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  // Loading Steps Carousel
  const steps = [
    "Analyzing competitor layouts in your industry vertical...",
    "Critiquing typography hierarchy and color balance...",
    "Formulating JayTech Visual Concepts strategic corrective actions...",
    "Calculating conversion (CRO) speed indexes...",
    "Securing Gemini AI deep auditing response weights..."
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAuditRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.businessName) {
      setError("Please complete all required fields (Name, Email, Phone, Business Name).");
      return;
    }

    setError(null);
    setLoading(true);
    setLoadingStep(0);

    // Dynamic Loading steps updater
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 2800);

    try {
      const response = await api.generateAudit(formData);
      setAuditResult(response.audit);
      clearInterval(stepInterval);
    } catch (err: any) {
      setError(err?.message || "Audit generation encountered an error. Please try again.");
      clearInterval(stepInterval);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAuditResult(null);
    setError(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      businessName: "",
      brandUrl: "",
      industry: "",
      goals: "",
      audience: "",
    });
  };

  return (
    <section id="audit" className="py-24 bg-white relative overflow-hidden text-slate-800">
      {/* Background glow node */}
      <div className="absolute top-[20%] left-[30%] w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[140px]" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        {/* Header Title */}
        <div className="mb-12">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2563EB] font-bold">
            06 // conversion optimization
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mt-2 mb-4">
            Free Visual Brand Audit
          </h2>
          <p className="text-slate-600 text-sm tracking-wide leading-relaxed max-w-2xl mx-auto">
            Stop losing premium prospects due to a dated visual layout. Submit your brand variables details below and let our Gemini-powered engine review your standing immediately.
          </p>
        </div>

        {/* Audit Form State Control */}
        <div className="bg-slate-50 border border-blue-100/90 rounded-3xl p-8 sm:p-12 hover:border-blue-200 transition-all text-left shadow-lg relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2563EB] via-blue-400 to-transparent" />

          <AnimatePresence mode="wait">
            {/* 1. INPUT FORM */}
            {!loading && !auditResult && (
              <motion.form
                key="audit-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleAuditRequest}
                className="space-y-6"
              >
                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-650 text-xs p-4 rounded-xl flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-550" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col text-left">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Sophia Sterling"
                      className="bg-white border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/25 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col text-left">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500 mb-2">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. sophia@brand.com"
                      className="bg-white border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/25 transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col text-left">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +1 (555) 019-2834"
                      className="bg-white border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/25 transition-colors"
                    />
                  </div>

                  {/* Business Name */}
                  <div className="flex flex-col text-left">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="e.g. Sterling Essentials Ltd"
                      className="bg-white border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/25 transition-colors"
                    />
                  </div>

                  {/* Website URL / Brand Link */}
                  <div className="flex flex-col text-left sm:col-span-2">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500 mb-2">
                      Website URL / Brand Link (Optional)
                    </label>
                    <input
                      type="url"
                      name="brandUrl"
                      value={formData.brandUrl}
                      onChange={handleInputChange}
                      placeholder="e.g. https://www.sterlingessentials.com"
                      className="bg-white border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/25 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-200/60">
                  {/* Industry */}
                  <div className="flex flex-col text-left">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500 mb-2">
                      Industry / Sector
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      placeholder="e.g. Smart FinTech, Skincare"
                      className="bg-white border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/25 transition-colors"
                    />
                  </div>

                  {/* Goals */}
                  <div className="flex flex-col text-left">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500 mb-2">
                      Brand Goals
                    </label>
                    <input
                      type="text"
                      name="goals"
                      value={formData.goals}
                      onChange={handleInputChange}
                      placeholder="e.g. Double series-A metrics"
                      className="bg-white border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/25 transition-colors"
                    />
                  </div>

                  {/* Target Audience */}
                  <div className="flex flex-col text-left">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500 mb-2">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      name="audience"
                      value={formData.audience}
                      onChange={handleInputChange}
                      placeholder="e.g. High-net-worth tech buyers"
                      className="bg-white border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/25 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#2563EB] to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl flex items-center justify-center space-x-2 group shadow-lg shadow-blue-500/20 cursor-pointer"
                  >
                    <span>
                      {formData.businessName
                        ? `Audit "${formData.businessName}" Design & Conversion Now`
                        : "Run Free Strategic Brand Audit"}
                    </span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                  <p className="text-slate-400 text-[10px] font-mono text-center mt-3">
                    ✔ Free service • Your variables results are securely synchronized in our database.
                  </p>
                </div>
              </motion.form>
            )}

            {/* 2. LOADING STATE WINDOW */}
            {loading && (
              <motion.div
                key="loading-box"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center flex flex-col items-center justify-center space-y-6"
              >
                <div className="relative">
                  <RefreshCw className="w-12 h-12 text-[#2563EB] animate-spin" />
                  <Cpu className="w-5 h-5 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-slate-900 text-lg font-bold tracking-tight">Calculating Brand Aesthetics...</h3>
                  <div className="h-1 w-64 bg-slate-200 rounded-full mx-auto overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#2563EB] to-blue-400 rounded-full"
                      animate={{ x: [-250, 250] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      style={{ width: "80px" }}
                    />
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingStep}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-[#2563EB] text-xs font-mono font-medium max-w-sm mx-auto h-8"
                    >
                      {steps[loadingStep]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* 3. AUDIT RESULT DISPLAY BOX */}
            {!loading && auditResult && (
              <motion.div
                key="audit-result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Result header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-6 gap-4">
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-slate-950 font-bold text-lg tracking-tight">Audit Successfully Generated</h3>
                      <p className="text-slate-500 text-xs font-mono">
                        Target Brand: <span className="text-[#2563EB] font-bold">{formData.businessName}</span>{formData.brandUrl && <> • <a href={formData.brandUrl} target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline font-bold">{formData.brandUrl}</a></>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold px-4 py-1.5 rounded-full">
                    <BarChart2 className="w-4 h-4" />
                    <span>Visual Standing Optimized</span>
                  </div>
                </div>

                {/* Styled Audit Output Viewport */}
                <div className="bg-white border border-blue-100 rounded-2xl p-6 sm:p-8 max-h-[420px] overflow-y-auto text-left text-xs sm:text-sm text-slate-700 leading-relaxed font-normal space-y-4 shadow-inner">
                  {auditResult.split("\n\n").map((para, idx) => {
                    if (para.startsWith("### ")) {
                      return (
                        <h4 key={idx} className="text-blue-600 font-bold text-lg tracking-tight pt-3 first:pt-0 border-b border-slate-100 pb-1">
                          {para.replace("### ", "")}
                        </h4>
                      );
                    } else if (para.startsWith("## ")) {
                      return (
                        <h4 key={idx} className="text-slate-950 font-bold text-xl tracking-tight pt-4 border-b border-slate-100 pb-2">
                          {para.replace("## ", "")}
                        </h4>
                      );
                    } else if (para.startsWith("1. ") || para.startsWith("2. ") || para.startsWith("3. ") || para.startsWith("4. ")) {
                      return (
                        <div key={idx} className="bg-blue-50/45 border-l-2 border-[#2563EB] pl-4 py-2 text-slate-800 font-medium my-2">
                          {para}
                        </div>
                      );
                    }
                    return <p key={idx} className="text-slate-650 font-medium leading-relaxed">{para}</p>;
                  })}
                </div>

                {/* Follow-up CTA Actions */}
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto text-slate-500 hover:text-slate-850 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1 py-3 px-4 rounded-xl hover:bg-slate-100"
                  >
                    <span>Run Another Audit</span>
                  </button>

                  <a
                    href="#contact"
                    className="w-full sm:w-auto bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span>Book Strategy Call</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
