/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { ServiceItem } from "../types";

interface ServicesProps {
  services: ServiceItem[];
  onBookService: (serviceName: string) => void;
}

// Simple lookup map for dynamic Lucide Icons
function getServiceIcon(iconName: string) {
  const IconComponent = (Icons as any)[iconName];
  if (IconComponent) {
    return <IconComponent className="w-6 h-6 text-[#2563EB]" />;
  }
  return <Icons.Sparkles className="w-6 h-6 text-[#2563EB]" />;
}

export default function Services({ services, onBookService }: ServicesProps) {
  return (
    <section id="services" className="py-24 bg-slate-50 border-t border-b border-blue-100/50 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[130px]" />
      <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] bg-purple-600/5 rounded-full blur-[110px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 animate-fade-in">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2563EB] font-bold">
            02 // Tailored Services
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mt-2 mb-4">
            Unmistakable Capabilities
          </h2>
          <p className="text-slate-600 text-sm tracking-wide leading-relaxed">
            We don&apos;t build cookie-cutter layouts. We engineer high-contrast brand ecosystems, lightning-fast full-stack frameworks, and premium multimedia content designed to scale conversion ratios.
          </p>
        </div>

        {/* Dynamic Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-white border border-blue-100 hover:border-[#2563EB]/40 rounded-3xl p-8 relative flex flex-col justify-between hover:shadow-lg hover:shadow-blue-500/5 transition-all group overflow-hidden"
            >
              {/* Sleek edge highlights */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-50 to-transparent group-hover:via-[#2563EB] transition-all duration-700" />

              <div>
                {/* Illustrative Service Image resembling the exact service */}
                {service.image && (
                  <div className="relative h-48 w-full mb-6 rounded-2xl overflow-hidden border border-blue-50/50 shadow-sm">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>
                )}

                {/* Header Icon Block */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 border border-blue-100 flex items-center justify-center shadow-md shadow-blue-500/5 group-hover:scale-105 transition-transform">
                    {getServiceIcon(service.iconName)}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block">
                      Starting AT
                    </span>
                    <span className="text-[#2563EB] text-lg font-black tracking-tight">
                      {service.priceStarting}
                    </span>
                  </div>
                </div>

                {/* Service Details */}
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#2563EB] font-bold block mb-1">
                  {service.tagline}
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Benefits List */}
                <div className="space-y-2 mb-8 border-t border-slate-100 pt-6">
                  {service.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-start space-x-2 text-xs">
                      <Icons.Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-750 font-medium tracking-tight">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Action */}
              <button
                onClick={() => onBookService(service.title)}
                className="w-full bg-slate-50 hover:bg-[#2563EB] hover:text-white border border-blue-100 hover:border-[#2563EB] text-slate-755 text-xs font-bold py-3 px-4 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center space-x-1 group/btn cursor-pointer"
              >
                <span>Inquire Spec</span>
                <Icons.ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
