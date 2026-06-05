/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Compass, Eye, ShieldCheck, Heart, User, Sparkles, TrendingUp, Cpu } from "lucide-react";

export default function About() {
  const values = [
    {
      title: "Design Courage",
      desc: "We do not settle for template defaults. We design with purpose, risk, and visionary courage to make sure you dominate your market sector.",
      icon: Sparkles,
      color: "text-[#2563EB]",
      bg: "bg-blue-500/10"
    },
    {
      title: "Conversion Priority",
      desc: "Stunning design is meaningless if the client drops off. Every image, grid ratio, and scrolling interaction we implement is structured to convert.",
      icon: TrendingUp,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10"
    },
    {
      title: "Technical Prowess",
      desc: "Our websites load instantly. We merge deep layout concepts with light, performant coding pipelines to secure perfect speed indices.",
      icon: Cpu,
      color: "text-purple-400",
      bg: "bg-purple-500/10"
    }
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden text-slate-800">
      {/* Light Blur Background */}
      <div className="absolute top-[30%] left-[5%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[90px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2563EB] font-bold">
            01 // Our Strategy
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mt-2 mb-4">
            The Story of JayTech
          </h2>
          <p className="text-slate-650 text-sm tracking-wide leading-relaxed font-medium">
            At JayTech, we operate on a single visual truth: in the modern digital arena, your aesthetic presentation is your ultimate leverage for enterprise value. Average design is an invisible tax on your customer acquisition; elite visual interfaces are an oil well of customer conviction. We craft high-fidelity digital systems that command price authority, erase friction, and turn passive searchers into loyal brand partners.
          </p>
        </div>

        {/* Narrative / Split Cards Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          {/* Left: Creative graphic visual statement */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden aspect-[4/3] border border-blue-100 shadow-xl group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=1200&q=80"
              alt="Creative office meeting"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 max-w-full"
              referrerPolicy="no-referrer"
            />
            {/* Overlay Branding Text */}
            <div className="absolute bottom-6 left-6 z-20">
              <span className="bg-[#2563EB] text-white text-[9px] font-mono uppercase font-bold px-3 py-1 rounded-full tracking-widest">
                EST. 2021
              </span>
              <p className="text-white text-lg font-bold mt-2 leading-tight">
                Architecting Visual Ecosystems That Speak Power
              </p>
            </div>
          </motion.div>

          {/* Right: Mission and Vision Cards */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-slate-50 border border-slate-200/60 p-8 rounded-2xl shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Our Strategic Mission</h3>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                To transform brands, startups, and creators into unmistakable market leaders by combining award-winning design logic, custom development layouts, and rigorous conversion optimization strategies.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-slate-50 border border-slate-200/60 p-8 rounded-2xl shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Our Global Vision</h3>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                To become the ultimate design agency of reference for businesses that decline the average. We envision a digital realm where beautiful user experience designs and high performance go hand in hand.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Why Choose Us: Values Bento */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#0B1220] tracking-tight">
              Why Choose JayTech?
            </h3>
            <p className="text-[#2563EB] text-xs mt-2 font-semibold uppercase tracking-wider">
              Three pillars that differentiate our deliverables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, idx) => {
              const IconComp = v.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="bg-slate-50 border border-blue-100 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 p-8 rounded-2xl transition-all hover:-translate-y-1 relative"
                >
                  <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center mb-6`}>
                    <IconComp className={`w-6 h-6 ${v.color}`} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 tracking-tight mb-3">
                    {v.title}
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {v.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
