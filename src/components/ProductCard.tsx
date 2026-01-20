// // src/components/ProductCard.tsx
// 'use client';

// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import Image from 'next/image';
// import Link from 'next/link';
// import { ShoppingCart, Heart, Eye, Zap, AlertCircle, Image as ImageIcon } from 'lucide-react';
// import WishlistButton from './WishlistButton';

// // 1. 🛠️ Define Interfaces matching your Backend Data
// interface ProductImage {
//   url: string;
//   publicId: string;
//   _id: string;
// }

// interface Product {
//   _id: string;
//   id?: string;
//   name: string;
//   partNumber?: string;
//   description?: string;
//   category: string;
//   price: number;
//   discountPrice?: number;
//   stock: number;
//   stockStatus?: string; // e.g., "In Stock"
//   images: ProductImage[]; // 👈 Changed from string[] to object array
//   compatibleModels?: any[];
// }

// interface ProductCardProps {
//   product: Product;
//   onAddToCart?: (product: Product) => void;
//   index?: number;
// }

// export const ProductCard: React.FC<ProductCardProps> = ({
//   product,
//   onAddToCart,
//   index = 0
// }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [imageError, setImageError] = useState(false);

//   // 🛡️ Safe ID Check
//   const productId = product._id || product.id;

//   if (!productId) {
//     return null;
//   }

//   // 🔧 SMART IMAGE URL FIX
//   const getImageUrl = () => {
//     // 1. Check if images array exists and has items
//     if (!product.images || product.images.length === 0) return null;

//     // 2. Extract the URL string from the first image object
//     const imageObj = product.images[0];
//     const imagePath = imageObj.url; // 👈 Access .url property

//     if (!imagePath) return null;

//     // 3. If it's already a full URL (Cloudinary), return it
//     if (imagePath.startsWith('http')) return imagePath;

//     // 4. If relative, prepend backend URL
//     const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
//     const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

//     return `${baseUrl}/${cleanPath}`;
//   };

//   const displayImage = getImageUrl();

//   // 🖼️ FALLBACK IMAGE
//   const fallbackImage = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600&auto=format&fit=crop";

//   // Calculate Discount
//   const discount = product.discountPrice
//     ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
//     : 0;

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (onAddToCart) {
//       onAddToCart(product);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-50px" }}
//       transition={{
//         duration: 0.5,
//         delay: index * 0.05,
//         ease: [0.22, 1, 0.36, 1]
//       }}
//       onHoverStart={() => setIsHovered(true)}
//       onHoverEnd={() => setIsHovered(false)}
//       className="group relative h-full"
//     >
//       <Link href={`/products/${productId}`} className="block h-full">
//         <div className="relative h-full bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-hyundai-blue/20 transition-all duration-300 flex flex-col">
//           <WishlistButton
//         productId={product._id}
//         showText={true}
//       />
//           {/* ✨ Glow Effect */}
//           <div
//             className={`absolute inset-0 bg-hyundai-blue/10 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
//           />

//           {/* 🏷️ Status Badges */}
//           <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
//             {product.stock <= 0 ? (
//               <span className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
//                 Out of Stock
//               </span>
//             ) : product.stock < 5 ? (
//               <span className="bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
//                 <Zap size={10} fill="currentColor" /> Low Stock
//               </span>
//             ) : null}
//           </div>

//           {/* 🏷️ Discount Badge */}
//           {discount > 0 && (
//             <div className="absolute top-3 right-3 z-20">
//               <span className="bg-yellow-400 text-black px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
//                 -{discount}%
//               </span>
//             </div>
//           )}

//           {/* 🖼️ Image Container */}
//           <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-black/20">
//             <motion.div
//               animate={{ scale: isHovered ? 1.08 : 1 }}
//               transition={{ duration: 0.7, ease: "easeOut" }}
//               className="w-full h-full relative"
//             >
//               <Image
//                 src={!imageError && displayImage ? displayImage : fallbackImage}
//                 alt={product.name}
//                 fill
//                 className="object-cover"
//                 onError={() => setImageError(true)}
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 unoptimized={true} // Helps with external Cloudinary images
//               />

//               {/* Fallback Overlay */}
//                {imageError && (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-400">
//                    <ImageIcon size={32} className="mb-2 opacity-50"/>
//                    <span className="text-xs">Preview Mode</span>
//                 </div>
//                )}
//             </motion.div>

//             {/* Quick Actions (Hover) */}
//             <div className="absolute right-3 bottom-3 flex flex-col gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
//               <button
//                 onClick={(e) => { e.preventDefault(); }}
//                 className="p-2.5 bg-white text-gray-700 rounded-full shadow-lg hover:bg-hyundai-blue hover:text-white transition-colors"
//               >
//                 <Heart size={16} />
//               </button>
//               <button className="p-2.5 bg-white text-gray-700 rounded-full shadow-lg hover:bg-hyundai-blue hover:text-white transition-colors">
//                 <Eye size={16} />
//               </button>
//             </div>
//           </div>

//           {/* 📝 Content Section */}
//           <div className="p-4 flex flex-col flex-grow">
//             <div className="mb-1">
//                <span className="text-[10px] font-bold tracking-widest text-hyundai-blue uppercase bg-hyundai-blue/5 px-2 py-0.5 rounded">
//                  {product.category || 'Spare Part'}
//                </span>
//             </div>

//             <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-2 mb-2 group-hover:text-hyundai-blue transition-colors">
//               {product.name}
//             </h3>

//             <div className="mt-auto pt-2 flex items-end justify-between">
//               <div className="flex flex-col">
//                  {product.discountPrice ? (
//                   <div className="flex flex-col">
//                     <span className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString()}</span>
//                     <span className="text-xl font-bold text-gray-900 dark:text-white">
//                       ₹{product.discountPrice.toLocaleString()}
//                     </span>
//                   </div>
//                 ) : (
//                   <span className="text-xl font-bold text-gray-900 dark:text-white">
//                     ₹{product.price.toLocaleString()}
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* Add to Cart Button */}
//             <motion.button
//               whileTap={{ scale: 0.95 }}
//               onClick={handleAddToCart}
//               disabled={product.stock <= 0}
//               className={`mt-4 w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-hyundai-blue/10
//                 ${product.stock <= 0
//                   ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-hyundai-blue to-blue-600 text-white hover:shadow-hyundai-blue/30'
//                 }`}
//             >
//               {product.stock <= 0 ? (
//                 'Out of Stock'
//               ) : (
//                 <>
//                   <ShoppingCart size={16} />
//                   Add to Cart
//                 </>
//               )}
//             </motion.button>
//           </div>
//         </div>
//       </Link>
//     </motion.div>
//   );
// };

// src/components/ProductCard.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye, Zap, Image as ImageIcon } from "lucide-react";
import WishlistButton from "./WishlistButton";

// Interfaces
interface ProductImage {
  url: string;
  publicId: string;
  _id: string;
}

interface Product {
  _id: string;
  id?: string;
  name: string;
  partNumber?: string;
  description?: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  stockStatus?: string;
  images: ProductImage[];
  compatibleModels?: any[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  index = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Safe ID Check
  const productId = product._id || product.id;

  if (!productId) {
    return null;
  }

  // Smart Image URL Fix
  const getImageUrl = () => {
    if (!product.images || product.images.length === 0) return null;
    const imageObj = product.images[0];
    const imagePath = imageObj.url;

    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;

    const cleanPath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      "http://localhost:5000";

    return `${baseUrl}/${cleanPath}`;
  };

  const displayImage = getImageUrl();
  const fallbackImage =
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600&auto=format&fit=crop";

  const discount = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative h-full"
    >
      <Link href={`/products/${productId}`} className="block h-full">
        <div className="relative h-full bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none hover:border-blue-200 dark:hover:border-white/20 transition-all duration-300 flex flex-col">
          {/* ✨ Glow Effect */}
          <div
            className={`absolute inset-0 bg-blue-50/50 dark:bg-hyundai-blue/10 pointer-events-none transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}
          />

          {/* 🖼️ Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-black/20 border-b border-gray-100 dark:border-white/5">
            {/* ❤️ WISHLIST BUTTON (Top Right) */}
            <div className="absolute top-3 right-3 z-30">
              <WishlistButton
                productId={product._id}
                className="bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-md hover:bg-white dark:hover:bg-black/70"
              />
            </div>

            {/* 🏷️ Status & Discount Badges (Left Side Stacked) */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 items-start">
              {product.stock <= 0 ? (
                <span className="bg-red-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  Out of Stock
                </span>
              ) : product.stock < 5 ? (
                <span className="bg-orange-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Zap size={10} fill="currentColor" /> Low Stock
                </span>
              ) : null}

              {discount > 0 && (
                <span className="bg-yellow-400 text-black px-2 py-1 rounded-md text-[10px] font-bold shadow-sm">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Product Image */}
            <motion.div
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full h-full relative"
            >
              <Image
                src={!imageError && displayImage ? displayImage : fallbackImage}
                alt={product.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized={true}
              />

              {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-400">
                  <ImageIcon size={32} className="mb-2 opacity-50" />
                  <span className="text-xs">Preview Mode</span>
                </div>
              )}
            </motion.div>

            {/* Quick Actions (Bottom Right - Removed Duplicate Heart) */}
            <div className="absolute right-3 bottom-3 flex flex-col gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <button
                onClick={(e) => {
                  e.preventDefault(); /* Open Quick View Logic */
                }}
                className="p-2 bg-white dark:bg-black/60 text-gray-700 dark:text-gray-200 rounded-full shadow-lg hover:bg-hyundai-blue dark:hover:bg-hyundai-blue hover:text-white dark:hover:text-white transition-colors backdrop-blur-sm"
                title="Quick View"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>

          {/* 📝 Content Section */}
          <div className="p-4 flex flex-col flex-grow">
            <div className="mb-2">
              <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded">
                {product.category || "Spare Part"}
              </span>
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-2 mb-2 group-hover:text-hyundai-blue transition-colors">
              {product.name}
            </h3>

            <div className="mt-auto pt-2 flex items-end justify-between">
              <div className="flex flex-col">
                {product.discountPrice ? (
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 line-through">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{product.discountPrice.toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`mt-4 w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-md hover:shadow-lg
                ${
                  product.stock <= 0
                    ? "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-hyundai-blue to-blue-600 text-white shadow-blue-500/25 hover:shadow-blue-500/40"
                }`}
            >
              {product.stock <= 0 ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Add to Cart
                </>
              )}
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
