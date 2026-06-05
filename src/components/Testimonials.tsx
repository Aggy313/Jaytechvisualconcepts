/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { TestimonialItem } from "../types";

interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (testimonials.length === 0) return null;
  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-slate-50 border-t border-b border-blue-100/50 relative overflow-hidden">
      {/* Background glowing rings */}
      <div className="absolute top-[40%] right-[30%] w-[320px] h-[320px] bg-blue-600/5 rounded-full blur-[90px]" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2563EB] font-bold">
            04 // Agency Trust
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mt-2">
            Social Proof
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-3 font-medium">
            Hear straight from the brand directors we have repositioned.
          </p>
        </div>

        {/* Carousel Window */}
        <div className="relative bg-white border border-blue-100 rounded-3xl p-8 sm:p-12 hover:border-blue-200 transition-all shadow-md">
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-[#2563EB] to-blue-400" />
          <Quote className="absolute top-8 right-8 w-12 h-12 text-[#2563EB] opacity-10" />

          {/* Testimonial Panel */}
          <div className="min-h-[220px] flex flex-col justify-between">
            <div>
              {/* Star rating */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < current.rating ? "fill-amber-500 text-amber-500" : "text-slate-200"
                    }`}
                  />
                ))}
              </div>

              {/* Review Content */}
              <blockquote className="text-slate-900 text-base sm:text-lg md:text-xl font-medium tracking-tight leading-relaxed italic mb-8">
                &ldquo;{current.review}&rdquo;
              </blockquote>
            </div>

            {/* Profile Sign-off */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <div className="flex items-center space-x-4">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#2563EB]"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <cite className="not-italic text-sm font-bold text-slate-900 block">
                    {current.name}
                  </cite>
                  <span className="text-slate-500 text-[11px] font-mono font-medium block">
                    {current.business}
                  </span>
                </div>
              </div>

              {/* Slider Handlers */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#2563EB] flex items-center justify-center transition focus:outline-none cursor-pointer"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#2563EB] flex items-center justify-center transition focus:outline-none cursor-pointer"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Dot indicators */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                currentIndex === idx ? "w-8 bg-[#2563EB]" : "w-1.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
