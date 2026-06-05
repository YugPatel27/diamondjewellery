import { motion } from "framer-motion";

export const effects = {
  fadeUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  },
  rotate: {
    initial: { opacity: 0, rotate: -8 },
    animate: { opacity: 1, rotate: 0, transition: { duration: 0.7, ease: "easeOut" } },
  },
  grayscale: {
    whileHover: { filter: "grayscale(0%)", scale: 1.05 },
    initial: { filter: "grayscale(100%)", scale: 1 },
    animate: { filter: "grayscale(0%)", scale: 1, transition: { duration: 0.5 } },
  },
  glow: {
    whileHover: { boxShadow: "0 0 24px 0 #ffe06699", scale: 1.04 },
    initial: { boxShadow: "0 0 0 0 #ffe06600", scale: 1 },
    animate: { boxShadow: "0 0 0 0 #ffe06600", scale: 1 },
  },
  tilt: {
    whileHover: { rotate: 2, scale: 1.03 },
    initial: { rotate: 0, scale: 1 },
    animate: { rotate: 0, scale: 1 },
  },
};
