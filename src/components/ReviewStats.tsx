// components/ReviewStats.tsx
'use client';

import { useState, useEffect } from 'react';
import { reviewAPI } from '@/lib/api/reviews';
import { ReviewStats as ReviewStatsType } from '@/types';
import StarRating from './StarRating';
import { Star } from 'lucide-react';

interface ReviewStatsProps {
  productId: string;
  refreshTrigger?: number;
}

export default function ReviewStats({ productId, refreshTrigger }: ReviewStatsProps) {
  const [stats, setStats] = useState<ReviewStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [productId, refreshTrigger]);

  const fetchStats = async () => {
    try {
      const response = await reviewAPI.getProductStats(productId);
      setStats(response.stats);
    } catch (error) {
      console.error('Error fetching review stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <Star className="h-16 w-16 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 text-lg font-medium">No reviews yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Be the first to share your experience
        </p>
      </div>
    );
  }

  const getPercentage = (count: number) => {
    return stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>

      {/* Overall Rating */}
      <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {stats.averageRating.toFixed(1)}
          </div>
          <StarRating rating={stats.averageRating} size="lg" showNumber={false} />
          <p className="text-sm text-gray-500 mt-2">
            Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Distribution Bars */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.distribution[rating as keyof typeof stats.distribution];
            const percentage = getPercentage(count);

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium text-gray-700">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                </div>

                {/* Progress Bar */}
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <span className="text-sm text-gray-600 w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rating Breakdown Summary */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-green-600">
            {stats.distribution[5] + stats.distribution[4]}
          </p>
          <p className="text-sm text-gray-600">Positive</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.distribution[3]}
          </p>
          <p className="text-sm text-gray-600">Neutral</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-red-600">
            {stats.distribution[2] + stats.distribution[1]}
          </p>
          <p className="text-sm text-gray-600">Negative</p>
        </div>
      </div>
    </div>
  );
}
