"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const offers = [
  {
    id: 1,
    title: "Republic Day Sale",
    subtitle: "Celebrate Freedom",
    discount: "FLAT 26% OFF",
    description: "On all Engine & Suspension parts. Valid till Jan 30th.",
    buttonText: "Shop Sale",
    link: "/products?category=sale",
    bgClass:
      "bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-orange-950 dark:via-gray-900 dark:to-green-950",
    textClass: "text-orange-700 dark:text-orange-500",
    buttonClass:
      "bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-600",
  },
  // 2. Mega Festival (Blue/Purple)
  {
    id: 2,
    title: "Mega Festival Dhamaka",
    subtitle: "Upgrade Your Hyundai",
    discount: "UP TO 50% OFF",
    description: "Huge discounts on Headlights, Bumpers & Accessories.",
    buttonText: "Grab Deal",
    link: "/products",
    bgClass:
      "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-gray-900 dark:to-purple-950",
    textClass: "text-blue-700 dark:text-blue-400",
    buttonClass:
      "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600",
  },
  // 3. Monsoon Safety (Gray/Black)
  {
    id: 3,
    title: "Monsoon Safety Drive",
    subtitle: "Wipers & Brakes Special",
    discount: "BUY 2 GET 10% OFF",
    description: "Ensure your family's safety with genuine brake pads.",
    buttonText: "Explore Parts",
    link: "/products?category=brakes",
    bgClass:
      "bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-900 dark:via-black dark:to-gray-800",
    textClass: "text-gray-800 dark:text-gray-300",
    buttonClass:
      "bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200",
  },
  // 4. Summer Cool (Cyan/Sky Blue)
  {
    id: 4,
    title: "Beat the Heat",
    subtitle: "AC & Cooling Systems",
    discount: "FLAT 15% OFF",
    description: "Keep your car cool with genuine AC filters and compressors.",
    buttonText: "Cool Deals",
    link: "/products?category=ac-parts",
    bgClass:
      "bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-950 dark:via-sky-900 dark:to-blue-950",
    textClass: "text-cyan-700 dark:text-cyan-400",
    buttonClass:
      "bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:text-black dark:hover:bg-cyan-400",
  },
  // 5. Power Performance (Red/Rose)
  {
    id: 5,
    title: "High Performance",
    subtitle: "Engine & Transmission",
    discount: "SAVE ₹2000",
    description: "Boost your pickup with premium spark plugs and clutch kits.",
    buttonText: "Power Up",
    link: "/products?category=engine",
    bgClass:
      "bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-red-950 dark:via-rose-900 dark:to-pink-950",
    textClass: "text-red-700 dark:text-red-400",
    buttonClass:
      "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-600",
  },
  // 6. Night Vision (Yellow/Amber)
  {
    id: 6,
    title: "Night Vision Sale",
    subtitle: "Lights & Electricals",
    discount: "UP TO 40% OFF",
    description: "Brighten your path with LED Headlamps and Fog lights.",
    buttonText: "Shine On",
    link: "/products?category=electrical",
    bgClass:
      "bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950 dark:via-amber-900 dark:to-orange-950",
    textClass: "text-amber-700 dark:text-yellow-400",
    buttonClass:
      "bg-amber-600 text-white hover:bg-amber-700 dark:bg-yellow-500 dark:text-black dark:hover:bg-yellow-400",
  },
  // 7. Smooth Ride (Teal/Emerald)
  {
    id: 7,
    title: "Smooth Ride Week",
    subtitle: "Suspension Overhaul",
    discount: "FLAT 20% OFF",
    description: "Get shock absorbers and link rods at unbeatable prices.",
    buttonText: "Fix Ride",
    link: "/products?category=suspension",
    bgClass:
      "bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 dark:from-teal-950 dark:via-emerald-900 dark:to-green-950",
    textClass: "text-teal-700 dark:text-teal-400",
    buttonClass:
      "bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-500 dark:text-white dark:hover:bg-teal-600",
  },
  // 8. Interior Luxury (Violet/Purple)
  {
    id: 8,
    title: "Interior Luxury",
    subtitle: "Mats & Covers",
    discount: "COMBO OFFERS",
    description: "Upgrade your cabin with 7D mats and premium seat covers.",
    buttonText: "Upgrade Now",
    link: "/products?category=accessories",
    bgClass:
      "bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950 dark:via-purple-900 dark:to-fuchsia-950",
    textClass: "text-violet-700 dark:text-violet-400",
    buttonClass:
      "bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:text-white dark:hover:bg-violet-600",
  },
  // 9. Body Shop (Indigo/Blue)
  {
    id: 9,
    title: "Body Shop Bonanza",
    subtitle: "Exterior Parts",
    discount: "UP TO 35% OFF",
    description: "Genuine bumpers, mirrors, and door handles available now.",
    buttonText: "Check Parts",
    link: "/products?category=body",
    bgClass:
      "bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 dark:from-indigo-950 dark:via-blue-900 dark:to-slate-950",
    textClass: "text-indigo-700 dark:text-indigo-400",
    buttonClass:
      "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-600",
  },
  // 10. Clearance Sale (Red/Orange Warning)
  {
    id: 10,
    title: "Stock Clearance",
    subtitle: "Everything Must Go",
    discount: "MIN 60% OFF",
    description: "Clearance sale on older model parts. Limited stock only!",
    buttonText: "Rush Now",
    link: "/products?category=clearance",
    bgClass:
      "bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100 dark:from-red-900 dark:via-orange-900 dark:to-yellow-900",
    textClass: "text-red-800 dark:text-red-300",
    buttonClass:
      "bg-red-700 text-white hover:bg-red-800 dark:bg-white dark:text-red-800 dark:hover:bg-gray-200",
  },
];

const FestivalCarousel = () => {
  return (
    <div className="w-full mt-4 mb-8 md:mt-8 md:mb-12 px-2 md:px-0">
      <div className="max-w-7xl mx-auto md:px-4">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            dynamicBullets: true, // మొబైల్ లో డాట్స్ చిన్నగా కనిపిస్తాయి
          }}
          navigation={true}
          // 👇 CSS Tricks: మొబైల్ లో Arrows హైడ్ చేసి, డెస్క్‌టాప్ లో చూపించడం
          className="rounded-xl md:rounded-2xl overflow-hidden shadow-lg dark:shadow-2xl border border-gray-200 dark:border-gray-800 
                     [&_.swiper-button-next]:hidden md:[&_.swiper-button-next]:flex 
                     [&_.swiper-button-prev]:hidden md:[&_.swiper-button-prev]:flex"
        >
          {offers.map((offer) => (
            <SwiperSlide key={offer.id}>
              {/* Height పెంచాను: h-[380px] for mobile, h-[450px] for desktop */}
              <div
                className={`relative h-[380px] md:h-[450px] w-full ${offer.bgClass} flex items-center transition-colors duration-300`}
              >
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>

                {/* Content Container */}
                <div className="relative z-10 container mx-auto px-6 sm:px-10 md:px-16 flex flex-col justify-center h-full items-start text-left">
                  {/* Badge */}
                  <span
                    className="inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wider mb-3 md:mb-4 
                    bg-white/80 dark:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 backdrop-blur-md shadow-sm"
                  >
                    LIMITED TIME OFFER
                  </span>

                  {/* Main Headlines - Responsive Text Sizes */}
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-2 tracking-tight text-gray-900 dark:text-white leading-tight">
                    {offer.title}
                  </h2>

                  <h3
                    className={`text-lg sm:text-xl md:text-3xl font-bold mb-3 md:mb-4 flex flex-col sm:flex-row gap-1 sm:gap-2 ${offer.textClass}`}
                  >
                    <span>{offer.subtitle}</span>
                    <span className="hidden sm:inline text-gray-400 dark:text-gray-600">
                      |
                    </span>
                    <span className="text-red-600 dark:text-yellow-400">
                      {offer.discount}
                    </span>
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg max-w-xs md:max-w-lg mb-6 md:mb-8 font-medium leading-relaxed">
                    {offer.description}
                  </p>

                  {/* Call to Action Button */}
                  <Link href={offer.link}>
                    <button
                      className={`${offer.buttonClass} px-6 py-2.5 md:px-8 md:py-3 rounded-lg text-sm md:text-base font-bold transition-all duration-300 transform hover:-translate-y-1 shadow-lg active:scale-95 flex items-center gap-2`}
                    >
                      {offer.buttonText}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 md:h-5 md:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
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
