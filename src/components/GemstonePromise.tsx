import { motion } from "framer-motion";
import gemstonesImg from "@/assets/gemstones-banner.png";

const GemstonePromise = () => (
  <motion.section
    className="relative rounded-[2.5rem] overflow-hidden bg-background p-0 border border-border/40 shadow-2xl my-16 group"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <div className="absolute inset-0 overflow-hidden">
      <motion.img
        src={gemstonesImg}
        alt="Diamond background"
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
    </div>
    <div className="relative z-10 flex flex-col items-start justify-center px-8 py-16 md:py-24 md:px-20 text-left max-w-3xl">
      <motion.h2
        className="font-heading text-3xl md:text-5xl font-light text-white mb-4 drop-shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        The Gemstone Promise
      </motion.h2>
      <motion.p
        className="max-w-2xl text-base md:text-lg text-white/80 mb-10 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.35 }}
      >
        Every gemstone in our collection is ethically sourced and verified by international laboratories for authenticity, color grade, and origin.
      </motion.p>
      <div className="flex flex-wrap gap-5 justify-start">
        <motion.a
          href="/education"
          className="px-8 py-3 rounded-full bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-accent hover:text-white transition-colors shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Learn About Gemstones
        </motion.a>
        <motion.a
          href="/customer-service"
          className="px-8 py-3 rounded-full bg-white/10 border border-white/30 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-colors shadow-lg backdrop-blur-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Consult an Expert
        </motion.a>
      </div>
    </div>
  </motion.section>
);

export default GemstonePromise;
