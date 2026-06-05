/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Instagram, Youtube, Linkedin, Facebook, Disc, Bookmark } from "lucide-react";
import { api } from "../lib/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const socials = [
    { name: "Instagram", url: "https://instagram.com/jaytechvisualconcenpts", handle: "@jaytechvisualconcenpts", icon: Instagram, color: "hover:text-[#E1306C]" },
    { name: "TikTok", url: "https://tiktok.com/@jaytechvisualconcenpts", handle: "@jaytechvisualconcenpts", icon: Disc, color: "hover:text-[#00F2FE]" },
    { name: "Facebook", url: "https://facebook.com/jaytechvisualconcenpts", handle: "@jaytechvisualconcenpts", icon: Facebook, color: "hover:text-[#1877F2]" },
    { name: "LinkedIn", url: "https://linkedin.com", handle: "JayTech Visual Concepts", icon: Linkedin, color: "hover:text-[#0A66C2]" },
    { name: "Behance", url: "https://behance.net", handle: "JayTech Visual Concepts", icon: Bookmark, color: "hover:text-[#0057FF]" },
    { name: "YouTube", url: "https://youtube.com/@jaytechvisualconcenpts", handle: "@jaytechvisualconcenpts", icon: Youtube, color: "hover:text-[#FF0000]" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Please fill out all contact fields.");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await api.submitMessage(formData);
      setSuccess(response.message || "Your inquiry has been logged in our pipeline. Thank you!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err?.message || "Inquiry submission failed. Please choose another method.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 border-t border-blue-100/50 relative overflow-hidden">
      {/* Visual Ambient Glow */}
      <div className="absolute bottom-[10%] right-[30%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[130px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2563EB] font-bold">
            07 // Global Operations
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mt-2 mb-4">
            Connect With JayTech
          </h2>
          <p className="text-slate-600 text-sm tracking-wide leading-relaxed">
            Ready to scale your visual presence? Shoot us notes, inquiries, or strategic parameters. All threads are secured in our central pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Block: Communication Coordinates & Social Matrix */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
              Design Center Coordinates
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              We operate globally, translating digital aesthetics across coordinates. Reach out via email, phone, or track our design entries on key channels below.
            </p>

            {/* Direct Channels */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-white border border-blue-100 shadow-sm p-4 rounded-xl hover:border-blue-300 transition">
                <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                  <Mail className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block font-semibold mb-0.5">
                    Chief Strategist Email
                  </span>
                  <a href="mailto:javanaggrey254@gmail.com" className="text-slate-950 text-xs sm:text-sm font-bold hover:text-[#2563EB] transition">
                    javanaggrey254@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-white border border-blue-100 shadow-sm p-4 rounded-xl hover:border-blue-300 transition">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-[#2563EB]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block font-semibold mb-0.5">
                    Lead Studio Hotlines
                  </span>
                  <a href="tel:0758743069" className="text-slate-950 text-xs sm:text-sm font-bold hover:text-[#2563EB] transition">
                    0758743069
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-white border border-blue-100 shadow-sm p-4 rounded-xl hover:border-blue-300 transition">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-pink-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block font-semibold mb-0.5">
                    HQ Coordinates
                  </span>
                  <span className="text-slate-950 text-xs sm:text-sm font-bold block">
                    Nairobi, Kenya // Global Digital Hub
                  </span>
                </div>
              </div>
            </div>

            {/* Social channels Matrix */}
            <div className="border-t border-slate-200/60 pt-8">
              <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold mb-4">
                Global Portfolio & Social Handles
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {socials.map((soc, sIdx) => {
                  const SvgIcon = soc.icon;
                  return (
                    <a
                      key={soc.name}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2.5 bg-white border border-slate-200 p-3 rounded-xl transition-all group hover:bg-slate-50 hover:border-blue-350 hover:scale-[1.02] shadow-sm"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-blue-50/50 transition-colors">
                        <SvgIcon className="w-5 h-5 text-slate-700 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <div className="text-left leading-tight min-w-0">
                        <span className="text-slate-500 text-[9px] font-mono font-bold block tracking-wider">{soc.name}</span>
                        <span className="text-slate-950 text-[11px] font-semibold tracking-tight block truncate">
                          {soc.handle}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Block: Secure Message Form */}
          <div className="lg:col-span-7 bg-white border border-blue-100 rounded-3xl p-8 sm:p-10 shadow-lg relative">
            <div className="absolute top-0 left-0 w-32 h-1 bg-[#2563EB]" />

            <h3 className="text-xl font-bold text-slate-950 tracking-tight text-left mb-6">
              Launch Direct Inquiry
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-5 text-left">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-750 text-xs p-4 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs p-4 rounded-xl flex items-center space-x-2 animate-pulse">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{success}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-500 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Elena Rostova"
                    className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/25 transition-colors"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-500 mb-1.5">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. elena@apex.co"
                    className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/25 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-500 mb-1.5">
                  Subject Parameters
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g. Website Redesign + Logo Guidelines proposal"
                  className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/25 transition-colors"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-500 mb-1.5">
                  Strategic Scope / Message Details
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your design obstacles, user friction points, timeline, and goals..."
                  className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/25 transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/15 cursor-pointer transition"
                >
                  {loading ? (
                    <span>Securing Pipeline Entry...</span>
                  ) : (
                    <>
                      <span>Transmit Inquiries Spec</span>
                      <CheckCircle className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
