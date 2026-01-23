// // src/app/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Image from 'next/image'; // 👈 Import Image
// import { ProductCard } from '@/components/ProductCard';
// import { Product, useStore } from '@/store/useStore';
// import apiClient from '@/services/apiClient';
// import toast from 'react-hot-toast';
// import { Search, Filter, ChevronRight, Sparkles } from 'lucide-react';
// import styles from './page.module.css';

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const { setCart, toggleCartDrawer } = useStore();

//   const categories = [
//     'all',
//     'Engine',
//     'Brake',
//     'Electrical',
//     'Body',
//     'Accessories',
//     'Suspension',
//     'Transmission'
//   ];

//   useEffect(() => {
//     fetchProducts();
//   }, [selectedCategory]);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const params: any = { limit: 12, page: 1 };
//       if (selectedCategory !== 'all') {
//         params.category = selectedCategory;
//       }

//       const response = await apiClient.get('/products', { params });

//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error: any) {
//       console.error('Error fetching products:', error);
//       toast.error('Failed to load products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = async (product: Product) => {
//     try {
//       const response = await apiClient.post('/cart/add', {
//         productId: product._id,
//         quantity: 1,
//       });

//       if (response.data.success) {
//         setCart(response.data.data.cart);
//         toast.success(`${product.name} added to cart!`);
//         toggleCartDrawer();
//       }
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.error || 'Failed to add to cart';
//       toast.error(errorMessage);
//     }
//   };

//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     product.partNumber.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     // 👇 Fixed Overlap: Added 'pt-20' to push content below Navbar
//     <div className={`${styles.container} pt-20`}>

//       {/* Hero Section */}
//       <section className={`${styles.hero} relative overflow-hidden min-h-[600px] flex items-center`}>
//         <div className={styles.heroBackground}>
//           <motion.div
//             className={styles.heroGradient}
//             animate={{
//               backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
//             }}
//             transition={{
//               duration: 10,
//               repeat: Infinity,
//               ease: 'linear',
//             }}
//           />
//         </div>

//         <div className={`${styles.heroContent} container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center`}>

//           {/* Left Side: Text */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="z-10"
//           >
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.6 }}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-hyundai-blue/20 backdrop-blur-sm rounded-full mb-6 border border-hyundai-blue/30"
//             >
//               <Sparkles className="text-blue-400" size={20} />
//               <span className="text-sm font-semibold text-blue-300">
//                 Premium Genuine Parts
//               </span>
//             </motion.div>

//             <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
//               <motion.span
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6, delay: 0.3 }}
//                 className="text-white block"
//               >
//                 Hyundai Spares
//               </motion.span>
//               <motion.span
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6, delay: 0.5 }}
//                 className="text-transparent bg-clip-text bg-gradient-to-r from-hyundai-blue to-blue-400"
//               >
//                 Engineered for Excellence
//               </motion.span>
//             </h1>

//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.6, delay: 0.7 }}
//               className="text-lg text-gray-300 mb-8 max-w-lg"
//             >
//               Discover premium genuine spare parts for your Hyundai vehicle.
//               Quality assured. Performance guaranteed.
//             </motion.p>

//             <motion.button
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.9 }}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="px-8 py-4 bg-gradient-to-r from-hyundai-blue to-blue-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/30 flex items-center gap-2 hover:gap-3 transition-all"
//               onClick={() => {
//                 document.getElementById('products')?.scrollIntoView({
//                   behavior: 'smooth'
//                 });
//               }}
//             >
//               Explore Products
//               <ChevronRight size={20} />
//             </motion.button>
//           </motion.div>

//           {/* Right Side: Car Image */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 1, delay: 0.5 }}
//             className="relative z-10 hidden md:block"
//           >
//             <motion.div
//               animate={{ y: [0, -15, 0] }}
//               transition={{
//                 duration: 6,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//               }}
//               className="relative w-full h-[300px] md:h-[400px]"
//             >
//               {/* 🛑 MAKE SURE TO ADD YOUR IMAGE TO public/images/hyundai-hero.png */}
//               <Image
//                 src="/images/hyundai-hero.png" // Replace with your actual file path
//                 alt="Hyundai Premium Car"
//                 fill
//                 className="object-contain drop-shadow-2xl"
//                 priority
//               />
//             </motion.div>
//           </motion.div>
//         </div>

//         {/* Scroll indicator */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1, delay: 1.2 }}
//           className="absolute bottom-8 left-1/2 -translate-x-1/2"
//         >
//           <motion.div
//             animate={{ y: [0, 10, 0] }}
//             transition={{ duration: 1.5, repeat: Infinity }}
//             className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2"
//           >
//             <div className="w-1 h-2 bg-white rounded-full" />
//           </motion.div>
//         </motion.div>
//       </section>

//       {/* Products Section */}
//       <section id="products" className={styles.productsSection}>
//         <div className={styles.productsContainer}>
//           {/* Section header */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//             className="text-center mb-12"
//           >
//             <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
//               Our Premium Collection
//             </h2>
//             <p className="text-gray-400">
//               Browse through our extensive range of genuine Hyundai spare parts
//             </p>
//           </motion.div>

//           {/* Filters */}
//           <div className={styles.filters}>
//             {/* Search bar */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               className={styles.searchContainer}
//             >
//               <Search className={styles.searchIcon} size={20} />
//               <input
//                 type="text"
//                 placeholder="Search by part name or number..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className={styles.searchInput}
//               />
//             </motion.div>

//             {/* Category filters */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               className={styles.categoryFilters}
//             >
//               <Filter size={20} className="text-hyundai-blue" />
//               <div className={styles.categoryButtons}>
//                 {categories.map((category) => (
//                   <motion.button
//                     key={category}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setSelectedCategory(category)}
//                     className={`${styles.categoryButton} ${
//                       selectedCategory === category ? styles.categoryButtonActive : ''
//                     }`}
//                   >
//                     {category === 'all' ? 'All Parts' : category}
//                   </motion.button>
//                 ))}
//               </div>
//             </motion.div>
//           </div>

//           {/* Products grid */}
//           {loading ? (
//             <div className={styles.loadingContainer}>
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//                 className={styles.loader}
//               />
//               <p className="text-gray-600 dark:text-gray-400 mt-4">
//                 Loading premium parts...
//               </p>
//             </div>
//           ) : filteredProducts.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className={styles.emptyState}
//             >
//               <div className="text-6xl mb-4">🔍</div>
//               <h3 className="text-2xl font-bold mb-2">No products found</h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Try adjusting your filters or search query
//               </p>
//             </motion.div>
//           ) : (
//             <div className={styles.productsGrid}>
//               {filteredProducts.map((product, index) => (
//                 <ProductCard
//                   key={product._id}
//                   product={product}
//                   onAddToCart={handleAddToCart}
//                   index={index}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { Product, useStore } from "@/store/useStore";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";
import { Search, Filter, ChevronRight, Sparkles } from "lucide-react";
import ProductCarousel from "@/components/ProductCarousel";
import FestivalCarousel from "@/components/FestivalCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { setCart, toggleCartDrawer } = useStore();

  const categories = [
    "all",
    "Engine",
    "Brake",
    "Electrical",
    "Body",
    "Accessories",
    "Suspension",
    "Transmission",
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 12, page: 1 };
      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }

      const response = await apiClient.get("/products", { params });

      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await apiClient.post("/cart/add", {
        productId: product._id,
        quantity: 1,
      });

      if (response.data.success) {
        setCart(response.data.data.cart);
        toast.success(`${product.name} added to cart!`);
        toggleCartDrawer();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to add to cart";
      toast.error(errorMessage);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.partNumber?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div className="min-h-screen pt-20 transition-colors duration-300 bg-gray-50 dark:bg-[#050B14] text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center bg-gray-100 dark:bg-[#050B14]">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
            <motion.div
              className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 blur-[100px]"
              animate={{
                transform: [
                  "translate(0,0) rotate(0deg)",
                  "translate(-20px,20px) rotate(10deg)",
                  "translate(0,0) rotate(0deg)",
                ],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center relative z-10 py-10 md:py-0">
            {/* Left Side: Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center md:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-hyundai-blue/20 backdrop-blur-sm rounded-full mb-6 border border-gray-200 dark:border-hyundai-blue/30 shadow-sm"
              >
                <Sparkles
                  className="text-blue-500 dark:text-blue-400"
                  size={20}
                />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                  Premium Genuine Parts
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-gray-900 dark:text-white block"
                >
                  Hyundai Spares
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-hyundai-blue to-blue-500"
                >
                  Engineered for Excellence
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto md:mx-0"
              >
                Discover premium genuine spare parts for your Hyundai vehicle.
                Quality assured. Performance guaranteed.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-hyundai-blue to-blue-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/30 flex items-center gap-2 hover:gap-3 transition-all mx-auto md:mx-0"
                onClick={() => {
                  document.getElementById("products")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Explore Products
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>

            {/* Right Side: Car Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative z-10 flex justify-center"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-full max-w-[400px] md:max-w-full h-[250px] md:h-[400px]"
              >
                <Image
                  src="/images/hyundai-hero.png" // Ensure this image exists in public folder
                  alt="Hyundai Premium Car"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-gray-400 dark:border-white/30 rounded-full flex justify-center p-2"
            >
              <div className="w-1 h-2 bg-gray-600 dark:bg-white rounded-full" />
            </motion.div>
          </motion.div>
        </section>
        <FestivalCarousel />
        <ProductCarousel />

        {/* Products Section */}
        <section
          id="products"
          className="py-16 px-4 md:px-8 bg-white dark:bg-[#0A101F] transition-colors duration-300"
        >
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Our Premium Collection
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Browse through our extensive range of genuine Hyundai spare
                parts
              </p>
            </motion.div>

            {/* Filters & Search - Responsive Layout */}
            <div className="flex flex-col md:flex-row gap-6 mb-12">
              {/* Search bar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative w-full md:w-80"
              >
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search parts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-hyundai-blue text-gray-900 dark:text-white transition-all shadow-sm"
                />
              </motion.div>

              {/* Category filters - Horizontal Scroll on Mobile */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide"
              >
                <Filter
                  size={20}
                  className="text-hyundai-blue flex-shrink-0 mr-2"
                />
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                        selectedCategory === category
                          ? "bg-hyundai-blue text-white border-hyundai-blue shadow-md shadow-blue-500/20"
                          : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10"
                      }`}
                    >
                      {category === "all" ? "All Parts" : category}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Products grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-hyundai-blue border-t-transparent rounded-full mb-4"
                />
                <p className="text-gray-600 dark:text-gray-400">
                  Loading premium parts...
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your filters or search query
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <ReviewsCarousel />
    </>
  );
}
