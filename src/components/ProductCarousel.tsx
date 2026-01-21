"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import apiClient from "@/services/apiClient";

// Swiper CSS Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Interfaces
interface ProductImage {
  url: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  finalPrice: number;
  stock: number;
  images: ProductImage[];
}

const ProductCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("/products/featured");
        if (response.data?.success && response.data?.data?.products) {
          setProducts(response.data.data.products);
        }
      } catch (error) {
        console.error("Failed to fetch carousel products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getImageUrl = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop";
  };

  if (loading) return null; // Or a skeleton loader
  if (products.length === 0) return null;

  return (
    // ✨ Container: Light mode (gray-50) & Dark mode (dark bg)
    <section className="w-full py-12 bg-gray-50 dark:bg-[#0f111a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title Section */}
        {/* Title Section - Mobile Optimized */}
        <div className="flex flex-row items-center justify-between mb-6 sm:mb-8 px-1 sm:px-0">
          {/* Left Side: Text */}
          <div className="flex flex-col gap-0.5 sm:gap-1">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs sm:text-base text-gray-500 dark:text-gray-400 font-medium">
              Top picks for your Hyundai
            </p>
          </div>

          {/* Right Side: Button */}
          <Link
            href="/products"
            className="group flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all hover:bg-blue-100 dark:hover:bg-blue-500/20 active:scale-95"
          >
            <span>View All</span>
            {/* Arrow Icon with Animation */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1.2} // Mobile లో పక్కన కార్డ్ కొంచెం కనిపించేలా (Intuitive scroll)
          navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 24 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="pb-14 !px-1" // Extra padding for shadow visibility
        >
          {products.map((product) => (
            <SwiperSlide key={product._id} className="h-auto">
              <Link href={`/products/${product._id}`} className="block h-full">
                {/* ✨ Card: White bg for Light mode, Dark bg for Dark mode */}
                <div className="h-full flex flex-col bg-white dark:bg-[#1a1d29] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500 transition-all duration-300 group">
                  {/* Image Area */}
                  <div className="relative h-48 sm:h-52 w-full bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                    <Image
                      src={getImageUrl(product)}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      unoptimized={true}
                    />

                    {/* Stock Badge */}
                    {product.stock <= 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">
                        OUT OF STOCK
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider">
                      {product.category}
                    </p>

                    <h3
                      className="text-gray-900 dark:text-white font-semibold text-base sm:text-lg leading-tight truncate mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-white/10">
                      <div className="flex flex-col">
                        {/* Discount Logic */}
                        {product.price > product.finalPrice ? (
                          <>
                            <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                              ₹{product.price.toLocaleString()}
                            </span>
                            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                              ₹{product.finalPrice.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                            ₹{product.finalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <button className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 active:scale-95">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductCarousel;
