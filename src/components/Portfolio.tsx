/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, MouseEvent, TouchEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Layers, ArrowRight, Eye, Star, Share2 } from "lucide-react";
import { ProjectItem } from "../types";

interface PortfolioProps {
  projects: ProjectItem[];
}

export default function Portfolio({ projects }: PortfolioProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Before / After Slider State
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  const categories = [
    "All",
    "Branding",
    "Logos",
    "Social Media",
    "Photography",
    "Videography",
    "Motion Graphics",
    "Websites",
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  // Handle Before/After Sliders (React Mouse Events)
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleSliderMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-white relative overflow-hidden text-slate-800">
      <div className="absolute top-[40%] left-[10%] w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2563EB] font-bold">
            03 // Client Records
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mt-2 mb-4">
            Visual Showcases
          </h2>
          <p className="text-slate-600 text-sm tracking-wide leading-relaxed">
            Case studies detailing our visual execution, the client obstacles, our custom solution blueprint, and quantitative growth metrics.
          </p>
        </div>

        {/* 1. BEFORE / AFTER COMPARISON TOOL */}
        <div className="mb-24">
          <div className="text-center mb-8">
            <span className="text-[#2563EB] text-xs font-mono uppercase font-bold tracking-widest pl-2 border-l border-[#2563EB]">
              Award-Winning Concept Comparison
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Slide to Compare: Original Template vs JayTech Redesign
            </h3>
          </div>

          <div
            ref={sliderContainerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative w-full max-w-4xl mx-auto h-[320px] sm:h-[480px] rounded-3xl overflow-hidden border border-blue-100 shadow-2xl select-none cursor-ew-resize"
          >
            {/* Before (Original dated asset) */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=1200&q=80"
                alt="Unoptimized website template"
                className="w-full h-full object-cover grayscale opacity-50 filter blur-[1px]"
              />
              <div className="absolute top-4 left-4 bg-red-100 border border-red-300 text-red-700 text-[10px] font-mono uppercase font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                Unoptimized Competitor Layout (Standard)
              </div>
            </div>

            {/* After (JayTech premium luxury redesign) */}
            <div
              className="absolute inset-0 h-full overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              {/* Force image to maintain regular aspect regardless of parent width */}
              <img
                src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80"
                alt="JayTech Premium visual design"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: "100%", maxWidth: "none" }}
              />
              <div className="absolute top-4 left-4 bg-emerald-100 border border-emerald-300 text-emerald-700 text-[10px] font-mono uppercase font-bold px-3 py-1.5 rounded-full backdrop-blur-md whitespace-nowrap shadow-sm">
                ● Redesigned by JayTech (Converting + Premium)
              </div>
            </div>

            {/* Vertical Divider */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#2563EB] z-20 cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-[#2563EB] border-2 border-white flex items-center justify-center shadow-xl">
                <span className="text-[10px] font-mono text-white font-bold">⇄</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. FILTERABLE CASE STUDIES GRID */}
        <div>
          {/* Filters Bar */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#2563EB] text-white border-[#2563EB] shadow-lg shadow-blue-500/20"
                    : "text-slate-600 bg-slate-50 border-slate-200 hover:text-[#2563EB] hover:bg-blue-50/50 hover:border-blue-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dynamic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="bg-slate-50 border border-blue-100 hover:border-blue-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-blue-500/5 group transition-all duration-500 cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* Hover Visual Cover */}
                    <div className="absolute inset-0 bg-[#2563EB]/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 z-20 bg-blue-900/90 text-white text-[10px] font-mono uppercase font-bold px-3 py-1.5 rounded-full border border-blue-600/20 backdrop-blur-md">
                      {project.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2 group-hover:text-[#2563EB] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-4 font-normal">
                      {project.description}
                    </p>
                    {/* Mini Stats Indicator */}
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#2563EB] border-t border-slate-200/60 pt-4">
                      <span>RESULTS INDEX:</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {project.results.split(",")[0]}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* 3. CASE STUDY DETAILED MODAL */}
        <AnimatePresence>
          {selectedProject && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedProject(null)}
              >
                {/* Modal Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  style={{ y: 0 }}
                  className="bg-white border border-blue-100 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Banner Image */}
                  <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
                    {/* Category */}
                    <span className="absolute top-4 left-4 bg-[#2563EB] text-white text-[9px] font-mono uppercase font-bold px-3 py-1.5 rounded-full">
                      {selectedProject.category}
                    </span>
                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-white flex items-center justify-center font-bold transition-all focus:outline-none cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="p-8">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-6">
                      {selectedProject.title}
                    </h3>

                    {/* Meta Case Study details */}
                    <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                      <div>
                        <span className="text-[#2563EB] font-mono uppercase font-bold tracking-wider block mb-1">
                          The Challenge
                        </span>
                        <p className="text-slate-600">{selectedProject.challenge}</p>
                      </div>

                      <div className="border-t border-slate-100 pt-4">
                        <span className="text-[#06B6D4] font-mono uppercase font-bold tracking-wider block mb-1">
                          Our Creative Solution
                        </span>
                        <p className="text-slate-600">{selectedProject.solution}</p>
                      </div>

                      <div className="border-t border-slate-100 pt-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <span className="text-[#2563EB] font-mono uppercase font-bold tracking-wider block mb-1">
                          Quantitative Impact Results
                        </span>
                        <p className="text-blue-950 font-bold leading-snug">
                          {selectedProject.results}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
