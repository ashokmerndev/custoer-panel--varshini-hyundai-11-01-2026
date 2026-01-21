// // src/app/products/[id]/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Image from 'next/image';
// import { useParams, useRouter } from 'next/navigation';
// import {
//   ShoppingCart,
//   Heart,
//   Share2,
//   Truck,
//   Shield,
//   ArrowLeft,
//   AlertTriangle,
//   Check,
//   Image as ImageIcon
// } from 'lucide-react';
// import apiClient from '@/services/apiClient';
// import { useStore } from '@/store/useStore';
// import toast from 'react-hot-toast';
// import styles from './page.module.css';

// // 🛠️ Interfaces matching Backend Data
// interface ProductImage {
//   url: string;
//   publicId: string;
//   _id: string;
// }

// interface CompatibleModel {
//   modelName: string;
//   yearFrom?: number;
//   yearTo?: number;
//   variant?: string;
//   _id?: string;
// }

// interface Product {
//   _id: string;
//   name: string;
//   partNumber: string;
//   description: string;
//   category: string;
//   price: number;
//   discountPrice?: number;
//   stock: number;
//   stockStatus?: string;
//   images: ProductImage[];
//   // Models can be strings (legacy) or objects (new)
//   compatibleModels: (CompatibleModel | string)[];
//   specifications?: Record<string, string>;
//   warrantyPeriod?: string;
// }

// export default function ProductDetailsPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { setCart, toggleCartDrawer } = useStore();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [addingToCart, setAddingToCart] = useState(false);

//   useEffect(() => {
//     if (params.id) {
//       fetchProduct();
//     }
//   }, [params.id]);

//   const fetchProduct = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get(`/products/${params.id}`);

//       if (response.data.success) {
//         // 🔍 CRITICAL FIX: Accessing data.product correctly
//         // Backend returns: { data: { product: { ... } } }
//         const productData = response.data.data.product || response.data.data;
//         setProduct(productData);
//       }
//     } catch (error: any) {
//       console.error('Error fetching product:', error);
//       toast.error('Failed to load product');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = async () => {
//     if (!product) return;

//     setAddingToCart(true);
//     try {
//       const response = await apiClient.post('/cart/add', {
//         productId: product._id,
//         quantity,
//       });

//       if (response.data.success) {
//         setCart(response.data.data.cart);
//         toast.success('Added to cart!');
//         toggleCartDrawer();
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || 'Failed to add to cart');
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   const handleQuantityChange = (delta: number) => {
//     const newQuantity = quantity + delta;
//     if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
//       setQuantity(newQuantity);
//     }
//   };

//   if (loading) {
//     return <LoadingSkeleton />;
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         Product not found
//       </div>
//     );
//   }

//   // 🛡️ SAFETY CALCULATIONS
//   // Ensure price is treated as number and has fallback
//   const price = Number(product.price) || 0;
//   const discountPrice = Number(product.discountPrice) || 0;

//   const currentPrice = discountPrice > 0 ? discountPrice : price;
//   const hasDiscount = discountPrice > 0 && discountPrice < price;
//   const savings = hasDiscount ? price - discountPrice : 0;
//   const discountPercentage = hasDiscount
//     ? Math.round((savings / price) * 100)
//     : 0;

//   const isLowStock = product.stock < 5 && product.stock > 0;
//   const isOutOfStock = product.stock <= 0;

//   return (
//     <div className={styles.container}>
//       {/* Back button */}
//       <motion.button
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         onClick={() => router.back()}
//         className={styles.backButton}
//       >
//         <ArrowLeft size={20} />
//         Back to Products
//       </motion.button>

//       <div className={styles.productContainer}>
//         {/* Left Column - Image Gallery */}
//         <motion.div
//           initial={{ opacity: 0, x: -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//           className={styles.imageSection}
//         >
//           {/* Main Image */}
//           <div className={styles.mainImageContainer}>
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={selectedImage}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.3 }}
//                 className={styles.mainImage}
//               >
//                 {product.images && product.images.length > 0 ? (
//                   <Image
//                     src={product.images[selectedImage]?.url || ''}
//                     alt={product.name}
//                     fill
//                     className="object-contain"
//                     priority
//                     unoptimized={true}
//                   />
//                 ) : (
//                   <div className={styles.noImage}>
//                     <ImageIcon size={64} className="text-gray-600 mb-4" />
//                     <p className="text-gray-500">No image available</p>
//                   </div>
//                 )}

//                 {/* Discount badge */}
//                 {hasDiscount && (
//                   <motion.div
//                     initial={{ scale: 0, rotate: -180 }}
//                     animate={{ scale: 1, rotate: 0 }}
//                     transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
//                     className={styles.discountBadge}
//                   >
//                     -{discountPercentage}% OFF
//                   </motion.div>
//                 )}
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           {/* Thumbnail Gallery */}
//           {product.images && product.images.length > 1 && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className={styles.thumbnailContainer}
//             >
//               {product.images.map((image, index) => (
//                 <motion.button
//                   key={image._id || index}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setSelectedImage(index)}
//                   className={`${styles.thumbnail} ${
//                     selectedImage === index ? styles.thumbnailActive : ''
//                   }`}
//                 >
//                   <Image
//                     src={image.url}
//                     alt={`${product.name} - ${index + 1}`}
//                     fill
//                     className="object-cover"
//                     unoptimized={true}
//                   />
//                 </motion.button>
//               ))}
//             </motion.div>
//           )}
//         </motion.div>

//         {/* Right Column - Product Details */}
//         <motion.div
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
//           className={styles.detailsSection}
//         >
//           {/* Part Number */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className={styles.partNumber}
//           >
//             Part #{product.partNumber || 'N/A'}
//           </motion.div>

//           {/* Product Name */}
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className={styles.productName}
//           >
//             {product.name}
//           </motion.h1>

//           {/* Category Badge */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             className="mb-4"
//           >
//             <span className="badge badge-primary">{product.category}</span>
//           </motion.div>

//           {/* Price Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6 }}
//             className={styles.priceContainer}
//           >
//             <div className={styles.currentPrice}>
//               ₹{currentPrice.toLocaleString()}
//             </div>
//             {hasDiscount && (
//               <>
//                 <div className={styles.originalPrice}>₹{price.toLocaleString()}</div>
//                 <div className={styles.savingsText}>
//                   You save ₹{savings.toLocaleString()}
//                 </div>
//               </>
//             )}
//           </motion.div>

//           {/* Stock Status */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.7 }}
//             className="mb-6"
//           >
//             {isOutOfStock ? (
//               <div className="badge badge-danger flex items-center gap-2">
//                 <AlertTriangle size={16} />
//                 Out of Stock
//               </div>
//             ) : isLowStock ? (
//               <div className="badge badge-warning flex items-center gap-2">
//                 <AlertTriangle size={16} />
//                 Only {product.stock} left in stock!
//               </div>
//             ) : (
//               <div className="badge badge-success flex items-center gap-2">
//                 <Check size={16} />
//                 In Stock ({product.stock} available)
//               </div>
//             )}
//           </motion.div>

//           {/* Compatible Models (Fixed Object Handling) */}
//           {product.compatibleModels && product.compatibleModels.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.8 }}
//               className={styles.compatibleModels}
//             >
//               <h3 className={styles.sectionTitle}>Compatible Models</h3>
//               <div className={styles.modelBadges}>
//                 {product.compatibleModels.map((model, index) => {
//                   // Handle both Object and String types safely
//                   const modelName = typeof model === 'string' ? model : model.modelName;

//                   return (
//                     <motion.span
//                       key={index}
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ delay: 0.8 + index * 0.1 }}
//                       className={styles.modelBadge}
//                     >
//                       {modelName}
//                     </motion.span>
//                   );
//                 })}
//               </div>
//             </motion.div>
//           )}

//           {/* Description */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.9 }}
//             className={styles.description}
//           >
//             <h3 className={styles.sectionTitle}>Description</h3>
//             <p className={styles.descriptionText}>{product.description}</p>
//           </motion.div>

//           {/* Specifications */}
//           {product.specifications && Object.keys(product.specifications).length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 1.0 }}
//               className={styles.specifications}
//             >
//               <h3 className={styles.sectionTitle}>Specifications</h3>
//               <div className={styles.specGrid}>
//                 {Object.entries(product.specifications).map(([key, value], index) => (
//                   <motion.div
//                     key={key}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 1.0 + index * 0.1 }}
//                     className={styles.specItem}
//                   >
//                     <span className={styles.specKey}>{key}</span>
//                     <span className={styles.specValue}>{value}</span>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {/* Warranty */}
//           {product.warrantyPeriod && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 1.1 }}
//               className={styles.warranty}
//             >
//               <Shield className="text-hyundai-blue" size={20} />
//               <span>{product.warrantyPeriod} Warranty</span>
//             </motion.div>
//           )}

//           {/* Quantity Selector */}
//           {!isOutOfStock && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 1.2 }}
//               className={styles.quantitySelector}
//             >
//               <h3 className={styles.sectionTitle}>Quantity</h3>
//               <div className={styles.quantityControls}>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleQuantityChange(-1)}
//                   disabled={quantity <= 1}
//                   className={styles.quantityButton}
//                 >
//                   -
//                 </motion.button>
//                 <span className={styles.quantityValue}>{quantity}</span>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleQuantityChange(1)}
//                   disabled={quantity >= product.stock}
//                   className={styles.quantityButton}
//                 >
//                   +
//                 </motion.button>
//               </div>
//             </motion.div>
//           )}

//           {/* Action Buttons */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 1.3 }}
//             className={styles.actionButtons}
//           >
//             <motion.button
//               whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
//               whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
//               onClick={handleAddToCart}
//               disabled={isOutOfStock || addingToCart}
//               className={styles.addToCartButton}
//             >
//               {addingToCart ? (
//                 <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               ) : (
//                 <>
//                   <ShoppingCart size={20} />
//                   {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
//                 </>
//               )}
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               className={styles.iconButton}
//             >
//               <Heart size={20} />
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               className={styles.iconButton}
//             >
//               <Share2 size={20} />
//             </motion.button>
//           </motion.div>

//           {/* Trust Badges */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 1.4 }}
//             className={styles.trustBadges}
//           >
//             <div className={styles.trustBadge}>
//               <Truck size={20} />
//               <div>
//                 <div className={styles.trustTitle}>Free Shipping</div>
//                 <div className={styles.trustSubtitle}>On orders above ₹5000</div>
//               </div>
//             </div>
//             <div className={styles.trustBadge}>
//               <Shield size={20} />
//               <div>
//                 <div className={styles.trustTitle}>Genuine Parts</div>
//                 <div className={styles.trustSubtitle}>100% Original</div>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// // Loading Skeleton Component
// function LoadingSkeleton() {
//   return (
//     <div className={styles.container}>
//       <div className={styles.productContainer}>
//         <div className={styles.imageSection}>
//           <div className={`${styles.mainImageContainer} skeleton`} />
//           <div className={styles.thumbnailContainer}>
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className={`${styles.thumbnail} skeleton`} />
//             ))}
//           </div>
//         </div>
//         <div className={styles.detailsSection}>
//           <div className="h-6 w-32 skeleton mb-4" />
//           <div className="h-12 w-full skeleton mb-4" />
//           <div className="h-8 w-40 skeleton mb-6" />
//           <div className="h-32 w-full skeleton mb-6" />
//           <div className="h-20 w-full skeleton" />
//         </div>
//       </div>
//     </div>
//   );
// }

// src/app/products/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  ArrowLeft,
  AlertTriangle,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import apiClient from "@/services/apiClient";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";

// 🛠️ Interfaces matching Backend Data
interface ProductImage {
  url: string;
  publicId: string;
  _id: string;
}

interface CompatibleModel {
  modelName: string;
  yearFrom?: number;
  yearTo?: number;
  variant?: string;
  _id?: string;
}

interface Product {
  _id: string;
  name: string;
  partNumber: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  stockStatus?: string;
  images: ProductImage[];
  compatibleModels: (CompatibleModel | string)[];
  specifications?: Record<string, string>;
  warrantyPeriod?: string;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { setCart, toggleCartDrawer } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/products/${params.id}`);

      if (response.data.success) {
        const productData = response.data.data.product || response.data.data;
        setProduct(productData);
      }
    } catch (error: any) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      const response = await apiClient.post("/cart/add", {
        productId: product._id,
        quantity,
      });

      if (response.data.success) {
        setCart(response.data.data.cart);
        toast.success("Added to cart!");
        toggleCartDrawer();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] flex items-center justify-center text-gray-900 dark:text-white pt-20">
        Product not found
      </div>
    );
  }

  // 🛡️ SAFETY CALCULATIONS
  const price = Number(product.price) || 0;
  const discountPrice = Number(product.discountPrice) || 0;

  const currentPrice = discountPrice > 0 ? discountPrice : price;
  const hasDiscount = discountPrice > 0 && discountPrice < price;
  const savings = hasDiscount ? price - discountPrice : 0;
  const discountPercentage = hasDiscount
    ? Math.round((savings / price) * 100)
    : 0;

  const isLowStock = product.stock < 5 && product.stock > 0;
  const isOutOfStock = product.stock <= 0;

  return (
    // 👇 Main Container with Theme Transition
    <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] text-gray-900 dark:text-white p-4 md:p-8 pt-24 md:pt-32 transition-colors duration-300">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-600 dark:text-gray-300 hover:text-hyundai-blue dark:hover:text-white hover:border-hyundai-blue/30 transition-all shadow-sm dark:shadow-none"
      >
        <ArrowLeft size={20} />
        Back to Products
      </motion.button>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          {/* Main Image */}
          <div className="group relative aspect-square w-full bg-gray-50 dark:bg-[#1a1d29] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm dark:shadow-none flex items-center justify-center">
            {/* Modern Floating Discount Badge */}
            {hasDiscount && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-4 right-4 z-20"
              >
                <div className="bg-yellow-400 text-black text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-full shadow-lg shadow-yellow-400/20 tracking-wide">
                  -{discountPercentage}% OFF
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-full h-full p-6 sm:p-8" // ✨ Perfect Padding for centering
              >
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImage]?.url || ""}
                    alt={product.name}
                    fill
                    // ✨ Magic Class: object-contain keeps ratio, drop-shadow adds depth, hover adds life
                    className="object-contain drop-shadow-xl transition-transform duration-700 ease-in-out group-hover:scale-110"
                    priority
                    unoptimized={true}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-300 dark:text-gray-700">
                    <ImageIcon size={64} className="mb-2 opacity-50" />
                    <p className="text-xs font-medium">No Image</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
            >
              {product.images.map((image, index) => (
                <motion.button
                  key={image._id || index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-hyundai-blue shadow-lg shadow-hyundai-blue/20"
                      : "border-gray-200 dark:border-white/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Right Column - Product Details */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col"
        >
          {/* Part Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-mono text-gray-500 dark:text-gray-400 mb-2"
          >
            Part #{product.partNumber || "N/A"}
          </motion.div>

          {/* Product Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400"
          >
            {product.name}
          </motion.h1>

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-hyundai-blue/20 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider">
              {product.category}
            </span>
          </motion.div>

          {/* Price Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-end gap-4 mb-8 p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl w-fit shadow-sm"
          >
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              ₹{currentPrice.toLocaleString()}
            </div>
            {hasDiscount && (
              <div className="flex flex-col mb-1">
                <div className="text-lg text-gray-400 line-through">
                  ₹{price.toLocaleString()}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Save ₹{savings.toLocaleString()}
                </div>
              </div>
            )}
          </motion.div>

          {/* Stock Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            {isOutOfStock ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-lg">
                <AlertTriangle size={18} />
                <span className="font-semibold">Out of Stock</span>
              </div>
            ) : isLowStock ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 rounded-lg">
                <AlertTriangle size={18} />
                <span className="font-semibold">
                  Only {product.stock} left in stock!
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20 rounded-lg">
                <Check size={18} />
                <span className="font-semibold">
                  In Stock ({product.stock} available)
                </span>
              </div>
            )}
          </motion.div>

          {/* Compatible Models */}
          {product.compatibleModels && product.compatibleModels.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <h3 className="text-lg font-semibold mb-3">Compatible Models</h3>
              <div className="flex flex-wrap gap-2">
                {product.compatibleModels.map((model, index) => {
                  const modelName =
                    typeof model === "string" ? model : model.modelName;
                  return (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg text-sm border border-gray-200 dark:border-white/5"
                    >
                      {modelName}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </motion.div>

          {/* Specifications */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(
                    ([key, value], index) => (
                      <div
                        key={key}
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5"
                      >
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {key}
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium text-sm">
                          {value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </motion.div>
            )}

          {/* Warranty */}
          {product.warrantyPeriod && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-8 p-4 bg-blue-50 dark:bg-hyundai-blue/10 rounded-xl border border-blue-100 dark:border-hyundai-blue/20"
            >
              <Shield className="text-hyundai-blue" size={20} />
              <span className="font-medium">
                {product.warrantyPeriod} Warranty
              </span>
            </motion.div>
          )}

          {/* Quantity & Action Buttons */}
          {!isOutOfStock && (
            <div className="mt-auto space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex items-center gap-4"
              >
                <h3 className="font-semibold">Quantity</h3>
                <div className="flex items-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="flex gap-4"
              >
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addingToCart}
                  className="flex-1 py-4 bg-gradient-to-r from-hyundai-blue to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {addingToCart ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </>
                  )}
                </button>

                <button className="p-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-white">
                  <Heart size={20} />
                </button>

                <button className="p-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-white">
                  <Share2 size={20} />
                </button>
              </motion.div>
            </div>
          )}

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-white/5 rounded-lg text-hyundai-blue">
                <Truck size={24} />
              </div>
              <div>
                <div className="font-bold text-sm">Free Shipping</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  On orders above ₹5000
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-white/5 rounded-lg text-hyundai-blue">
                <Shield size={24} />
              </div>
              <div>
                <div className="font-bold text-sm">Genuine Parts</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  100% Original
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] p-4 md:p-8 pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 dark:bg-white/5 rounded-3xl animate-pulse" />
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-20 h-20 bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-6 w-32 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
          <div className="h-12 w-3/4 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
          <div className="h-20 w-48 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
          <div className="h-40 w-full bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
