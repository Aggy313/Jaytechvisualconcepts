/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What variables does the Free Brand Audit review?",
      a: "Our Gemini AI engine evaluates your industry benchmark, core value proposition clarity, and uncovers visual blockages. Our principal designers then review high-fidelity scores to draft real corrections for you."
    },
    {
      q: "Do you supply raw editable source files?",
      a: "Yes. All creative identity guides, logo grids, photography exports, and custom developed systems are delivered in raw vector assets (.SVG, .AI, .PSD), Figma layout links, and clean typesafe React repositories."
    },
    {
      q: "Why do you develop custom code instead of utilizing templates?",
      a: "Template scripts (like standard WordPress nodes) carry significant asset bloat, slowing down page speeds and hurting search ratings. Our custom systems load instantly (Lighthouse 95+), retaining traffic and maximizing conversion weight by 40%."
    },
    {
      q: "How does the strategic consultation booking operate?",
      a: "Once registered, choose a spec channel. We schedule a brief 15-minute wireframe outline review to formulate exactly what steps are required to reposition your digital authority."
    }
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-blue-100/50">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
          <HelpCircle className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Strategic Questions
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            Answers regarding our design craft, delivery schedules, and visual algorithms.
          </p>
        </div>

        {/* Accordion Blocks */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm hover:border-blue-300 transition-all text-left cursor-pointer"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <div className="p-6 flex items-center justify-between gap-4">
                  <h3 className="text-slate-900 text-sm sm:text-base font-bold tracking-tight">
                    {faq.q}
                  </h3>
                  <button className="text-slate-400 hover:text-slate-600 shrink-0 focus:outline-none">
                    {isOpen ? <Minus className="w-5 h-5 text-[#2563EB]" /> : <Plus className="w-5 h-5 text-[#2563EB]" />}
                  </button>
                </div>

                {isOpen && (
                  <div className="px-6 pb-6 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
