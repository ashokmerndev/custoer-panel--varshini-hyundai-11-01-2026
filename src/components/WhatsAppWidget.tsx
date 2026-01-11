// src/components/WhatsAppWidget.tsx
'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const WhatsAppWidget = () => {
  const phoneNumber = '8096936290'; // Replace with actual number
  const message = 'Hi, I need help with a spare part.';
  
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };
  const pathname = usePathname();
    if (pathname === '/login' || pathname === '/register' || pathname?.startsWith('/admin')) {
      return null;
    }

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 group"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-green-500 rounded-full opacity-25 blur-xl"
      />
      
      <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-2xl flex items-center justify-center">
        <MessageCircle size={28} className="text-white" />
        
        {/* Notification dot */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
        />
      </div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-20 top-1/2 -translate-y-1/2 whitespace-nowrap px-4 py-2 bg-white dark:bg-hyundai-obsidian rounded-lg shadow-xl pointer-events-none"
      >
        <div className="text-sm font-semibold">Chat with us</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">We're here to help!</div>
      </motion.div>
    </motion.button>
  );
};
