import React from "react";
import { motion } from "framer-motion";

interface Feature {
  icon?: React.ReactNode;
  image?: string;
  title: string;
  desc: string;
}

interface GenericFeatureGridProps {
  title: string;
  subtitle?: string;
  description?: string;
  features: Feature[];
  className?: string;
  sideImage?: string; // New prop for side image layout
}

const GenericFeatureGrid: React.FC<GenericFeatureGridProps> = ({
  title,
  subtitle,
  description,
  features,
  className = "",
  sideImage,
}) => {
  return (
    <section className={`px-4 py-12 sm:px-6 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[4rem] border border-border/40 bg-card/20 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/5">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Left/Side Image Section (Conditional) */}
            {sideImage && (
              <div className="relative min-h-[400px] lg:min-h-[auto] overflow-hidden">
                <motion.img
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1.5 }}
                  src={sideImage}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent lg:hidden" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />

                {/* Floating Badge on Image */}
                <div className="absolute bottom-10 left-10 p-6 rounded-2xl bg-background/30 backdrop-blur-xl border border-white/10 hidden sm:block">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-1">Quality First</p>
                  <p className="text-[9px] text-white/70 italic font-serif">Hand-selected for Diamond Jewels</p>
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className={`p-8 sm:p-12 lg:p-20 flex flex-col justify-center ${!sideImage ? "lg:col-span-2" : ""}`}>
              <div className="mb-16">
                {subtitle && (
                  <div className="inline-flex items-center gap-2 mb-6">
                    <div className="h-px w-8 bg-accent" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">
                      {subtitle}
                    </p>
                  </div>
                )}
                <h2 className="font-heading text-4xl sm:text-6xl font-light text-foreground tracking-tight leading-[1.1] mb-8">
                  {title}
                </h2>
                {description && (
                  <p className="text-lg font-light leading-relaxed text-muted-foreground max-w-xl">
                    {description}
                  </p>
                )}
              </div>

              {/* Unique Features List/Grid */}
              <div className={`grid gap-12 ${!sideImage ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2"}`}>
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background transition-all duration-500">
                        {f.icon}
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-light text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                          {f.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground font-light">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenericFeatureGrid;
