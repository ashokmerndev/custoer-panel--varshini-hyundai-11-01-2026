'use client';

import { motion } from 'framer-motion';

// Animation transition settings for smooth infinite loops
const spinTransition = {
  repeat: Infinity,
  ease: "linear",
  duration: 2 // 2 seconds for a full rotation
};

const pulseTransition = {
  repeat: Infinity,
  repeatType: "reverse" as const,
  ease: "easeInOut",
  duration: 1.5
};

const dotTransition = {
    repeat: Infinity,
    repeatType: "reverse" as const,
    duration: 0.6,
    ease: "easeInOut"
};

export default function Loading() {
  return (
    // Full screen container with dark background matching your theme
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050B14] overflow-hidden">
      
      {/* 1. Background Glow Effect (Blurred blob behind spinner) */}
      <motion.div
        initial={{ opacity: 0.5, scale: 0.8 }}
        animate={{ opacity: 0.8, scale: 1.2 }}
        transition={pulseTransition}
        className="absolute h-64 w-64 rounded-full bg-blue-600/20 blur-[100px]"
      />

      <div className="relative flex flex-col items-center justify-center gap-8">
        {/* 2. The Main Spinner Assembly */}
        <div className="relative h-24 w-24">
          {/* Outer Ring (Gradient, rotates clockwise) */}
          <motion.span
            animate={{ rotate: 360 }}
            transition={spinTransition}
            className="absolute inset-0 box-border rounded-full border-4 border-t-blue-500 border-r-cyan-400 border-b-blue-500/30 border-l-cyan-400/30"
          />
          
          {/* Inner Ring (Solid, rotates counter-clockwise faster) */}
          <motion.span
            animate={{ rotate: -360 }}
            transition={{ ...spinTransition, duration: 1.5 }}
            className="absolute inset-3 box-border rounded-full border-4 border-t-transparent border-r-transparent border-b-blue-400 border-l-blue-400"
          />

          {/* Center Icon or Logo Placeholder (Optional - currently a pulsing dot) */}
          <motion.div 
             animate={{ scale: [1, 1.2, 1] }}
             transition={pulseTransition}
             className="absolute inset-0 m-auto h-4 w-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]"
          />
        </div>

        {/* 3. Loading Text with Bouncing Dots */}
        <div className="flex items-center text-lg font-medium text-gray-300 tracking-wider">
          <span>Loading System</span>
          <motion.span
            className="ml-1 flex items-center gap-1"
            initial="start"
            animate="end"
          >
            {/* Three dots bouncing sequentially */}
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                className="h-1.5 w-1.5 rounded-full bg-blue-400"
                variants={{
                    start: { y: 0 },
                    end: { y: -6 }
                }}
                transition={{
                    ...dotTransition,
                    delay: index * 0.15 // Stagger delay for wave effect
                }}
              />
            ))}
          </motion.span>
        </div>

        {/* Optional tagline */}
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-gray-500 font-mono -mt-4"
        >
            Please wait while we fetch your data...
        </motion.p>
      </div>
    </div>
  );
}