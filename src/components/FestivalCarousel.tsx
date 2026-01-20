'use client';

import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const offers = [
  {
    id: 1,
    title: "Republic Day Sale",
    subtitle: "Celebrate Freedom with Genuine Parts",
    discount: "FLAT 26% OFF",
    description: "On all Engine & Suspension parts. Valid till Jan 30th.",
    buttonText: "Shop Sale",
    link: "/products?category=sale",
    // Light Mode: Subtle Orange/Green | Dark Mode: Deep Orange/Green
    bgClass: "bg-gradient-to-r from-orange-100 via-white to-green-100 dark:from-orange-900 dark:via-white/10 dark:to-green-900",
    textClass: "text-orange-700 dark:text-orange-500",
    buttonClass: "bg-orange-600 text-white hover:bg-orange-700 dark:bg-white dark:text-orange-900 dark:hover:bg-gray-200"
  },
  {
    id: 2,
    title: "Mega Festival Dhamaka",
    subtitle: "Upgrade Your Hyundai Today",
    discount: "UP TO 50% OFF",
    description: "Huge discounts on Headlights, Bumpers & Accessories.",
    buttonText: "Grab Deal",
    link: "/products",
    // Light Mode: Light Blue | Dark Mode: Deep Blue
    bgClass: "bg-gradient-to-r from-blue-50 via-blue-100 to-white dark:from-blue-900 dark:via-blue-800 dark:to-gray-900",
    textClass: "text-blue-700 dark:text-yellow-400",
    buttonClass: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-white dark:text-blue-900 dark:hover:bg-gray-200"
  },
  {
    id: 3,
    title: "Monsoon Safety Drive",
    subtitle: "Wipers & Brakes Special",
    discount: "BUY 2 GET 10% OFF",
    description: "Ensure your family's safety with genuine brake pads.",
    buttonText: "Explore Parts",
    link: "/products?category=brakes",
    // Light Mode: Light Gray | Dark Mode: Dark Gray/Black
    bgClass: "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-black",
    textClass: "text-gray-800 dark:text-blue-400",
    buttonClass: "bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
  }
];

const FestivalCarousel = () => {
  return (
    <div className="w-full mt-6 mb-12">
      <div className="max-w-7xl mx-auto px-4">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          // Border changes based on theme (Light: Gray-200, Dark: Gray-800)
          className="rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-800"
        >
          {offers.map((offer) => (
            <SwiperSlide key={offer.id}>
              {/* bgClass now handles both light and dark backgrounds */}
              <div className={`relative h-[300px] md:h-[400px] w-full ${offer.bgClass} flex items-center transition-colors duration-300`}>
                
                {/* Decorative Pattern - Low opacity for texture */}
                <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                
                {/* Content Container */}
                <div className="relative z-10 container mx-auto px-6 md:px-16 flex flex-col justify-center h-full">
                  
                  {/* Badge - Adaptive Colors */}
                  <span className="inline-block w-fit px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-4 
                    bg-gray-900/10 text-gray-900 border-gray-900/20 
                    dark:bg-white/10 dark:text-white dark:border-white/20 border backdrop-blur-sm">
                    LIMITED TIME OFFER
                  </span>

                  {/* Main Headlines - Dark Text on Light BG, White Text on Dark BG */}
                  <h2 className="text-4xl md:text-6xl font-extrabold mb-2 tracking-tight text-gray-900 dark:text-white">
                    {offer.title}
                  </h2>
                  
                  <h3 className={`text-xl md:text-3xl font-bold mb-4 ${offer.textClass}`}>
                    {offer.subtitle} <span className="text-gray-400 dark:text-gray-500">|</span> {offer.discount}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-700 dark:text-gray-300 text-sm md:text-lg max-w-lg mb-8 font-medium">
                    {offer.description}
                  </p>

                  {/* Call to Action Button - Adaptive */}
                  <Link href={offer.link}>
                    <button className={`${offer.buttonClass} px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center gap-2`}>
                      {offer.buttonText}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </Link>

                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FestivalCarousel;