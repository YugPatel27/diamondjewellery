import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, Calendar, ChevronRight } from "@/components/Icons";
import consultationImg from "@/assets/consultation_banner_new.png";

interface ExpertGuidanceProps {
  backgroundImage?: string;
  title?: string;
  description?: string;
}

const ExpertGuidance = ({ 
  backgroundImage = consultationImg,
  title = "Discover the perfect piece with Expert Guidance",
  description = "Whether you're looking for a bespoke engagement ring or a timeless anniversary gift, our jewelry experts are here to help you navigate our collections."
}: ExpertGuidanceProps) => {
  return (
    <section className="px-4 sm:px-6 py-20 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto relative group">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] border border-border/20 bg-card shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] min-h-[520px] flex items-center"
        >
          {/* Background Image with Cinematic Overlay */}
          <div className="absolute inset-0">
            <motion.img 
              src={backgroundImage} 
              alt="Luxury Consultation" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-&lsqb;2000ms&rsqb; ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-transparent" />
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 w-[50%] h-full bg-[radial-gradient(circle_at_top_right,rgba(212,155,23,0.1),transparent_70%)]" />
          </div>
          
          <div className="relative z-10 p-10 sm:p-24 text-left max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-accent/10 border border-accent/30 mb-10 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(212,155,23,1)]" />
              <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-accent">Personal Concierge</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-heading text-4xl sm:text-6xl font-light mb-10 text-foreground leading-[1.1] tracking-tight"
            >
              {title.split("with").map((part, i) => (
                <React.Fragment key={i}>
                  {i === 1 && "with "}
                  <span className={i === 1 ? "italic text-accent gold-glow" : ""}>{part}</span>
                </React.Fragment>
              ))}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-foreground/80 mb-14 max-w-2xl text-base sm:text-lg leading-relaxed font-light"
            >
              {description}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 items-center sm:items-start"
            >
              <Link 
                to="/book-appointment" 
                className="group relative w-full sm:w-auto px-12 py-5 bg-accent text-accent-foreground font-bold tracking-[0.3em] uppercase text-[11px] rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(212,155,23,0.5)] hover:-translate-y-1 shadow-lg"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Calendar className="w-4.5 h-4.5" /> Book a viewing
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
              
              <Link 
                to="/customer-service" 
                className="group w-full sm:w-auto px-12 py-5 border border-border/60 bg-white/5 backdrop-blur-md text-foreground font-bold tracking-[0.3em] uppercase text-[11px] rounded-full transition-all duration-300 hover:border-accent hover:text-accent flex items-center justify-center gap-3 shadow-sm"
              >
                <MessageSquare className="w-4.5 h-4.5" /> Chat with us
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


export default ExpertGuidance;

