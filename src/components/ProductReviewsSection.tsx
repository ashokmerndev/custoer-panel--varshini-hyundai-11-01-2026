// components/ProductReviewsSection.tsx
'use client';

import { useState } from 'react';
import ReviewStats from './ReviewStats';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

interface ProductReviewsSectionProps {
  productId: string;
}

export default function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSubmitted = () => {
    // Trigger refresh of stats and list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats and Form */}
        <div className="lg:col-span-1 space-y-6">
          <ReviewStats productId={productId} refreshTrigger={refreshTrigger} />
          <ReviewForm productId={productId} onSuccess={handleReviewSubmitted} />
        </div>

        {/* Right Column - Review List */}
        <div className="lg:col-span-2">
          <ReviewList productId={productId} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}
