// // src/app/categories/page.tsx
// 'use client';

// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import {
//   Wrench,
//   Car,
//   Zap,
//   Disc,
//   Settings,
//   Wind,
//   Sparkles,
//   ArrowRight
// } from 'lucide-react';

// const categories = [
//   { id: 'Engine', name: 'Engine Parts', icon: Settings, description: 'Pistons, filters, and core engine components', color: 'bg-blue-500' },
//   { id: 'Body', name: 'Body Parts', icon: Car, description: 'Bumpers, mirrors, hoods, and panels', color: 'bg-indigo-500' },
//   { id: 'Brake', name: 'Brake System', icon: Disc, description: 'Pads, discs, calipers, and fluids', color: 'bg-red-500' },
//   { id: 'Electrical', name: 'Electrical', icon: Zap, description: 'Lights, batteries, sensors, and wiring', color: 'bg-yellow-500' },
//   { id: 'Suspension', name: 'Suspension', icon: Wrench, description: 'Shocks, struts, and steering parts', color: 'bg-green-500' },
//   { id: 'Transmission', name: 'Transmission', icon: Settings, description: 'Clutch kits, gears, and fluids', color: 'bg-orange-500' },
//   { id: 'AC', name: 'AC & Cooling', icon: Wind, description: 'Compressors, radiators, and fans', color: 'bg-cyan-500' },
//   { id: 'Accessories', name: 'Accessories', icon: Sparkles, description: 'Floor mats, covers, and upgrades', color: 'bg-purple-500' },
// ];

// export default function CategoriesIndexPage() {
//   return (
//     <div className="min-h-screen bg-[#050B14] text-white p-6 md:p-12 pt-[70px] md:pt-[80px] lg:pt-[110px]">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-center mb-16"
//       >
//         <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-hyundai-blue to-blue-400 mb-4">
//           Browse Categories
//         </h1>
//         <p className="text-gray-400 text-lg max-w-2xl mx-auto">
//           Find exactly what you need for your Hyundai. Select a category to start browsing genuine spare parts.
//         </p>
//       </motion.div>

//       {/* Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
//         {categories.map((category, index) => (
//           <motion.div
//             key={category.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.05 }}
//           >
//             <Link href={`/categories/${category.id}`} className="block h-full">
//               <motion.div
//                 whileHover={{ y: -5, scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-hyundai-blue/50 transition-all group relative overflow-hidden"
//               >
//                 {/* Glow Effect */}
//                 <div className={`absolute top-0 right-0 w-32 h-32 ${category.color} blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity`} />

//                 <div className="relative z-10">
//                   <div className={`w-14 h-14 rounded-xl ${category.color}/20 flex items-center justify-center mb-6 text-${category.color.replace('bg-', '')} group-hover:scale-110 transition-transform duration-300`}>
//                     <category.icon size={28} className="text-white" />
//                   </div>

//                   <h3 className="text-xl font-bold mb-2 group-hover:text-hyundai-blue transition-colors">
//                     {category.name}
//                   </h3>

//                   <p className="text-sm text-gray-400 mb-6 line-clamp-2">
//                     {category.description}
//                   </p>

//                   <div className="flex items-center text-sm font-medium text-hyundai-blue opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
//                     View Products <ArrowRight size={16} className="ml-2" />
//                   </div>
//                 </div>
//               </motion.div>
//             </Link>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }//

// src/app/categories/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Wrench,
  Car,
  Zap,
  Disc,
  Settings,
  Wind,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    id: "Engine",
    name: "Engine Parts",
    icon: Settings,
    description: "Pistons, filters, and core engine components",
    color: "bg-blue-500",
  },
  {
    id: "Body",
    name: "Body Parts",
    icon: Car,
    description: "Bumpers, mirrors, hoods, and panels",
    color: "bg-indigo-500",
  },
  {
    id: "Brake",
    name: "Brake System",
    icon: Disc,
    description: "Pads, discs, calipers, and fluids",
    color: "bg-red-500",
  },
  {
    id: "Electrical",
    name: "Electrical",
    icon: Zap,
    description: "Lights, batteries, sensors, and wiring",
    color: "bg-yellow-500",
  },
  {
    id: "Suspension",
    name: "Suspension",
    icon: Wrench,
    description: "Shocks, struts, and steering parts",
    color: "bg-green-500",
  },
  {
    id: "Transmission",
    name: "Transmission",
    icon: Settings,
    description: "Clutch kits, gears, and fluids",
    color: "bg-orange-500",
  },
  {
    id: "AC",
    name: "AC & Cooling",
    icon: Wind,
    description: "Compressors, radiators, and fans",
    color: "bg-cyan-500",
  },
  {
    id: "Accessories",
    name: "Accessories",
    icon: Sparkles,
    description: "Floor mats, covers, and upgrades",
    color: "bg-purple-500",
  },
];

export default function CategoriesIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] text-gray-900 dark:text-white p-6 md:p-12 pt-[70px] md:pt-[80px] lg:pt-[110px] transition-colors duration-300">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-hyundai-blue to-blue-400 mb-4">
          Browse Categories
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Find exactly what you need for your Hyundai. Select a category to
          start browsing genuine spare parts.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/categories/${category.id}`} className="block h-full">
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-xl dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/10 hover:border-hyundai-blue/50 transition-all group relative overflow-hidden"
              >
                {/* Glow Effect (Subtler in Light Mode) */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 ${category.color} blur-[80px] opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity`}
                />

                <div className="relative z-10">
                  {/* Icon Container */}
                  <div
                    className={`w-14 h-14 rounded-xl ${category.color}/10 dark:${category.color}/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {/* Icon Color: Dynamic color in Light Mode, White in Dark Mode */}
                    <category.icon
                      size={28}
                      className={`text-gray-900 dark:text-white`}
                    />
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-hyundai-blue transition-colors">
                    {category.name}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="flex items-center text-sm font-medium text-hyundai-blue opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                    View Products <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
