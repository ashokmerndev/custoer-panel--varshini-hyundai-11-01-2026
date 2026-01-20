// // components/ReviewForm.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { reviewAPI } from '@/lib/api/reviews';
// import { toast } from 'react-hot-toast';
// import StarRating from './StarRating';
// import { AlertCircle, CheckCircle } from 'lucide-react';

// interface ReviewFormProps {
//   productId: string;
//   onSuccess?: () => void;
// }

// export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [canReview, setCanReview] = useState(false);
//   const [isChecking, setIsChecking] = useState(true);
//   const [reviewStatus, setReviewStatus] = useState<{
//     canReview: boolean;
//     reason?: string;
//   }>({ canReview: false });

//   useEffect(() => {
//     checkReviewEligibility();
//   }, [productId]);

//   const checkReviewEligibility = async () => {
//     try {
//       const response = await reviewAPI.canUserReview(productId);
//       setCanReview(response.canReview);
//       setReviewStatus(response);
//     } catch (error: any) {
//       if (error.response?.status === 401) {
//         setReviewStatus({
//           canReview: false,
//           reason: 'not_logged_in',
//         });
//       }
//     } finally {
//       setIsChecking(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (rating === 0) {
//       toast.error('Please select a rating');
//       return;
//     }

//     if (comment.trim().length < 10) {
//       toast.error('Review must be at least 10 characters');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       await reviewAPI.createReview({
//         productId,
//         rating,
//         comment: comment.trim(),
//       });

//       toast.success('Review submitted successfully!');
//       setRating(0);
//       setComment('');

//       if (onSuccess) {
//         onSuccess();
//       }
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Failed to submit review';
//       toast.error(errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isChecking) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="animate-pulse space-y-4">
//           <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//           <div className="h-10 bg-gray-200 rounded"></div>
//           <div className="h-32 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!canReview) {
//     let message = '';
//     let icon = null;

//     switch (reviewStatus.reason) {
//       case 'already_reviewed':
//         message = 'You have already reviewed this product.';
//         icon = <CheckCircle className="h-5 w-5 text-green-500" />;
//         break;
//       case 'not_purchased':
//         message = 'You can only review products you have purchased and received.';
//         icon = <AlertCircle className="h-5 w-5 text-yellow-500" />;
//         break;
//       case 'not_logged_in':
//         message = 'Please login to write a review.';
//         icon = <AlertCircle className="h-5 w-5 text-blue-500" />;
//         break;
//       default:
//         message = 'You cannot review this product at this time.';
//         icon = <AlertCircle className="h-5 w-5 text-gray-500" />;
//     }

//     return (
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
//         {icon}
//         <p className="text-blue-900">{message}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Rating Selection */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Your Rating <span className="text-red-500">*</span>
//           </label>
//           <StarRating
//             rating={rating}
//             size="lg"
//             interactive
//             onRatingChange={setRating}
//           />
//           {rating > 0 && (
//             <p className="mt-2 text-sm text-gray-600">
//               {rating === 1 && 'Poor'}
//               {rating === 2 && 'Fair'}
//               {rating === 3 && 'Good'}
//               {rating === 4 && 'Very Good'}
//               {rating === 5 && 'Excellent'}
//             </p>
//           )}
//         </div>

//         {/* Comment */}
//         <div>
//           <label
//             htmlFor="comment"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Your Review <span className="text-red-500">*</span>
//           </label>
//           <textarea
//             id="comment"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             rows={5}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//             placeholder="Share your experience with this product..."
//             minLength={10}
//             maxLength={1000}
//             required
//           />
//           <div className="flex justify-between mt-2">
//             <p className="text-sm text-gray-500">Minimum 10 characters</p>
//             <p
//               className={`text-sm ${
//                 comment.length > 1000 ? 'text-red-500' : 'text-gray-500'
//               }`}
//             >
//               {comment.length}/1000
//             </p>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
//           className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
//         >
//           {isSubmitting ? (
//             <span className="flex items-center justify-center gap-2">
//               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//               Submitting...
//             </span>
//           ) : (
//             'Submit Review'
//           )}
//         </button>
//       </form>
//     </div>
//   );
// }
