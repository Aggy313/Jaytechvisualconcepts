/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Clock, ArrowRight, User, Calendar, BookOpen } from "lucide-react";
import { BlogPostItem } from "../types";

interface BlogProps {
  blogs: BlogPostItem[];
}

export default function Blog({ blogs }: BlogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activePost, setActivePost] = useState<BlogPostItem | null>(null);

  const categories = ["All", "Branding", "Websites", "Motion Graphics"];

  const filteredBlogs = blogs.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate related posts matching the same category (excluding current)
  const getRelatedPosts = (currentPost: BlogPostItem) => {
    return blogs
      .filter((post) => post.category === currentPost.category && post.id !== currentPost.id)
      .slice(0, 2);
  };

  return (
    <section id="blog" className="py-24 bg-white relative overflow-hidden text-slate-800">
      <div className="absolute top-[60%] right-[30%] w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2563EB] font-bold">
            05 // Creative Intelligence
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mt-2 mb-4">
            Strategic Insights
          </h2>
          <p className="text-slate-600 text-sm tracking-wide leading-relaxed">
            Thought-leadership articles tracking conversions, visual designs theory, and aesthetic engineering in 2026.
          </p>
        </div>

        {/* Search and Category Filters Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-slate-50 border border-slate-200/65 p-4 rounded-3xl">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#2563EB] text-white"
                    : "text-slate-600 bg-white border border-slate-200 hover:text-[#2563EB] hover:bg-blue-50/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Keyword Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search strategic insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/25 transition-all"
            />
          </div>
        </div>

        {/* Blogs Feed Dynamic List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((post) => (
            <article
              key={post.id}
              className="bg-slate-50 border border-blue-100 rounded-3xl overflow-hidden hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group flex flex-col justify-between"
            >
              <div
                className="cursor-pointer"
                onClick={() => setActivePost(post)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-[#2563EB] text-white text-[9px] font-mono uppercase font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {post.category}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 text-left">
                  <div className="flex items-center space-x-3 text-slate-500 text-[10px] font-mono mb-3">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-950 tracking-tight leading-tight mb-2 group-hover:text-[#2563EB] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              {/* Bottom author and action */}
              <div className="p-6 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#2563EB] to-blue-400 flex items-center justify-center text-white text-[9px] font-bold">
                    JT
                  </div>
                  <span className="text-slate-700 font-medium">{post.author}</span>
                </div>

                <button
                  onClick={() => setActivePost(post)}
                  className="text-[#2563EB] group-hover:text-blue-800 text-xs font-bold tracking-wider flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </article>
          ))}

          {filteredBlogs.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-sm">No strategic articles match your search filter.</p>
            </div>
          )}
        </div>

        {/* 4. FULL BLOG READER OVERLAY MODAL */}
        <AnimatePresence>
          {activePost && (
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setActivePost(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-blue-100 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative my-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Fixed Top Close Button */}
                <button
                  onClick={() => setActivePost(null)}
                   className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-white flex items-center justify-center font-bold transition cursor-pointer"
                >
                  ✕
                </button>

                {/* Banner Hero */}
                <div className="relative h-64 sm:h-96 w-full">
                  <img
                    src={activePost.image}
                    alt={activePost.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="bg-[#2563EB] text-white text-[9px] font-mono uppercase font-bold px-3 py-1 rounded-full mb-3 inline-block">
                      {activePost.category}
                    </span>
                    <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                      {activePost.title}
                    </h3>
                  </div>
                </div>

                {/* Information Metadata */}
                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-slate-500 mb-8 pb-4 border-b border-slate-100">
                    <span className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Written by {activePost.author}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>{activePost.date}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      <span>{activePost.readTime}</span>
                    </span>
                  </div>

                  {/* HTML Content (Paragraphs parsed cleanly) */}
                  <div className="prose prose-slate max-w-none text-left text-slate-700 text-xs sm:text-sm leading-relaxed mb-12 space-y-4">
                    {activePost.content.split("\n\n").map((para, idx) => {
                      if (para.startsWith("## ")) {
                        return (
                          <h4 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
                            {para.replace("## ", "")}
                          </h4>
                        );
                      } else if (para.startsWith("### ")) {
                        return (
                          <h5 key={idx} className="text-base sm:text-lg font-bold text-[#2563EB] tracking-tight pt-2">
                            {para.replace("### ", "")}
                          </h5>
                        );
                      }
                      return <p key={idx} className="text-slate-600 font-normal leading-relaxed">{para}</p>;
                    })}
                  </div>

                  {/* RELATED POSTS BLOCK */}
                  <div className="border-t border-slate-100 pt-8">
                    <h4 className="text-lg font-bold text-slate-950 tracking-tight mb-6">
                      Related Insights (In {activePost.category})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {getRelatedPosts(activePost).map((related) => (
                        <div
                          key={related.id}
                          onClick={() => setActivePost(related)}
                          className="bg-slate-50 border border-blue-100 p-4 rounded-2xl hover:border-blue-300 transition-all text-left cursor-pointer flex gap-4"
                        >
                          <img
                            src={related.image}
                            alt={related.title}
                            className="w-16 h-16 rounded-xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex flex-col justify-between">
                            <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                              {related.title}
                            </h5>
                            <span className="text-slate-500 text-[10px] font-mono">
                              {related.readTime}
                            </span>
                          </div>
                        </div>
                      ))}
                      {getRelatedPosts(activePost).length === 0 && (
                        <p className="text-xs text-slate-400 font-mono">No other related insights found in this vertical.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
