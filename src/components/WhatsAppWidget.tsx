// src/components/WhatsAppWidget.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";

export const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(true); // Control tooltip visibility
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  const phoneNumber = "918096936290";
  const message =
    "Hello Varshini Spares! 👋 I have a query regarding a Hyundai spare part. Can you please assist me?";

  // Show the tooltip initially, then hide after 5 seconds to reduce clutter (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // Hide on specific routes
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname?.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* 1. Modern Chat Bubble (Tooltip) */}
      <AnimatePresence>
        {(isOpen || isHovered) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="origin-bottom-right mb-2 mr-2"
          >
            <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-4 rounded-2xl rounded-tr-sm shadow-xl max-w-[200px]">
              {/* Close button for tooltip */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={12} />
              </button>

              <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                Need Help? 👋
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Chat with our spare parts expert directly on WhatsApp.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. The Main Button Container */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        className="relative group"
      >
        {/* Ripple Effect 1 */}
        <motion.div
          animate={{ scale: [1, 1.5, 1.8], opacity: [0.5, 0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 bg-green-500 rounded-full z-0"
        />

        {/* Ripple Effect 2 (Delayed) */}
        <motion.div
          animate={{ scale: [1, 1.5, 1.8], opacity: [0.5, 0.2, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 1,
          }}
          className="absolute inset-0 bg-green-400 rounded-full z-0"
        />

        {/* Actual Button */}
        <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-[0_8px_30px_rgb(34,197,94,0.4)] flex items-center justify-center border border-white/20">
          <MessageCircle
            size={28}
            className="text-white fill-white/10"
            strokeWidth={2}
          />

          {/* Online Indicator Dot */}
          <span className="absolute top-3 right-3 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-green-600"></span>
          </span>
        </div>
      </motion.button>
    </div>
  );
};
