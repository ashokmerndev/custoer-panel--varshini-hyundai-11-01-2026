"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const reviews = [
  {
    id: 1,
    name: "Ravi Teja",
    car: "Hyundai Creta",
    rating: 5,
    comment:
      "Original parts received! I was worried about quality, but the bumper fits perfectly. Fast delivery to Hyderabad.",
    initial: "R",
  },
  {
    id: 2,
    name: "Suresh Reddy",
    car: "Hyundai Verna",
    rating: 5,
    comment:
      "Best price compared to local market. The headlight assembly was packed very securely. Highly recommended!",
    initial: "S",
  },
  {
    id: 3,
    name: "Anil Kumar",
    car: "Hyundai i20",
    rating: 4,
    comment:
      "Good service. The part is genuine, but delivery took one extra day. Overall satisfied with the purchase.",
    initial: "A",
  },
  {
    id: 4,
    name: "Karthik Varma",
    car: "Hyundai Venue",
    rating: 5,
    comment:
      "Found rare parts for my Venue here. Customer support helped me choose the right model. Thank you Varshini Spares!",
    initial: "K",
  },
  {
    id: 5,
    name: "Manoj P",
    car: "Hyundai Tucson",
    rating: 5,
    comment:
      "Premium quality and genuine finish. Will definitely order brake pads from here next time.",
    initial: "M",
  },
];

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex text-yellow-400 mb-3">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${i < rating ? "fill-current" : "text-gray-300 dark:text-gray-600"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ReviewsCarousel = () => {
  return (
    <div className="w-full py-16 bg-gray-50 dark:bg-[#0f111a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Trusted by thousands of Hyundai owners across India for genuine
            spares and reliable service.
          </p>
        </div>

        {/* Carousel */}
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12 px-2"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="pb-8">
              <div className="bg-white dark:bg-[#1a1d29] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 h-full flex flex-col">
                {/* User Info Header */}
                <div className="flex items-center gap-4 mb-4">
                  {/* Avatar Circle */}
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl">
                    {review.initial}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      {review.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Owner of {review.car}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <StarRating rating={review.rating} />

                {/* Comment */}
                <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed flex-grow">
                  "{review.comment}"
                </p>

                {/* Verified Badge */}
                <div className="mt-6 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified Purchase
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ReviewsCarousel;
