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

// 👇 1. Interface Definition (To fix TypeScript errors)
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
  // 👇 2. Adding Type to State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("/products/featured");

        // 👇 Optional Chaining & Type Safety
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

  // 👇 3. Typing the argument
  const getImageUrl = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop";
  };

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <div className="w-full py-10 bg-[#0f111a]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title Section */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Featured Products
            </h2>
            <p className="text-gray-400">Top picks for your Hyundai</p>
          </div>
          <Link
            href="/products"
            className="text-blue-500 hover:text-blue-400 font-medium text-sm"
          >
            View All &rarr;
          </Link>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="pb-12"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id}>
              <Link href={`/products/${product._id}`} className="block h-full">
                <div className="bg-[#1a1d29] border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300 group h-full flex flex-col">
                  {/* Image Area */}
                  <div className="relative h-48 w-full bg-white/5 flex items-center justify-center overflow-hidden">
                    <Image
                      src={getImageUrl(product)}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized={true}
                    />

                    {/* Stock Badge */}
                    {product.stock <= 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                        OUT OF STOCK
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="text-xs text-blue-400 font-semibold mb-1 uppercase tracking-wider">
                      {product.category}
                    </p>

                    <h3
                      className="text-white font-medium text-lg truncate mb-2"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex flex-col">
                        {/* Discount Logic */}
                        {product.price > product.finalPrice ? (
                          <>
                            <span className="text-xs text-gray-400 line-through">
                              ₹{product.price.toLocaleString()}
                            </span>
                            <span className="text-xl font-bold text-white">
                              ₹{product.finalPrice.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-white">
                            ₹{product.finalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-lg shadow-blue-900/20">
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
    </div>
  );
};

export default ProductCarousel;
