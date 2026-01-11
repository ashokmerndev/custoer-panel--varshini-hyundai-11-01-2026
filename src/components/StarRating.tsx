// components/StarRating.tsx
'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.floor(rating);
        const isPartial = starValue === Math.ceil(rating) && rating % 1 !== 0;
        const partialPercentage = isPartial ? (rating % 1) * 100 : 0;

        return (
          <button
            key={index}
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={`relative ${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
            }`}
            type="button"
          >
            {isPartial ? (
              <div className="relative">
                <Star className={`${sizeClasses[size]} text-gray-300`} />
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: `${partialPercentage}%` }}
                >
                  <Star
                    className={`${sizeClasses[size]} text-yellow-400 fill-current`}
                  />
                </div>
              </div>
            ) : (
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            )}
          </button>
        );
      })}
      {showNumber && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
