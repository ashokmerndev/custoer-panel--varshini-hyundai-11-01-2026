// src/app/orders/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  CheckCircle,
  CreditCard,
  Calendar,
  AlertCircle,
  Phone,
  MapPin,
  XCircle,
  AlertTriangle,
  X,
  Truck
} from 'lucide-react';
import apiClient from '@/services/apiClient';
import toast from 'react-hot-toast';

// Helper for images
const getImageUrl = (imagePath: string | undefined) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''; 
  return `${baseUrl}/${cleanPath}`;
};

const ORDER_STEPS = ['Placed', 'Packed', 'Shipped', 'Delivered'];

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // --- New States for Cancellation ---
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails();
    }
  }, [params.id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/orders/${params.id}`);
      
      if (response.data.success && response.data.data.order) {
        setOrder(response.data.data.order);
      } else {
        setOrder(response.data.data);
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      if (error.response?.status === 429) {
          toast.error("Too many requests. Please wait.");
      } else {
          toast.error('Failed to load order');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- CANCEL ORDER FUNCTION ---
  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      setCancelling(true);
      const response = await apiClient.put(`/orders/${params.id}/cancel`, {
        cancellationReason: cancelReason
      });
      
      if (response.data.success) {
        toast.success('Order cancelled successfully');
        setShowCancelModal(false);
        setCancelReason('');
        fetchOrderDetails();
      }
    } catch (error: any) {
      console.error("Cancel error:", error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getProgressWidth = (status: string) => {
    if (!status || status === 'Cancelled') return 0;
    const index = ORDER_STEPS.indexOf(status);
    if (index === -1) return 0;
    return ((index + 1) / ORDER_STEPS.length) * 100;
  };

  const isStepCompleted = (step: string, currentStatus: string) => {
    if (!currentStatus || currentStatus === 'Cancelled') return false;
    const stepIndex = ORDER_STEPS.indexOf(step);
    const currentIndex = ORDER_STEPS.indexOf(currentStatus);
    return stepIndex <= currentIndex;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] p-4 md:p-8 pt-32 md:pt-40 flex justify-center transition-colors duration-300">
        <div className="w-10 h-10 border-4 border-hyundai-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] text-gray-900 dark:text-white p-4 pt-32 md:pt-40 flex flex-col items-center justify-center transition-colors duration-300">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <button 
          onClick={() => router.push('/orders')}
          className="mt-4 px-4 py-2 bg-gray-200 dark:bg-white/10 rounded-lg hover:bg-gray-300 dark:hover:bg-white/20 transition-colors text-gray-800 dark:text-white"
        >
          Return to Orders
        </button>
      </div>
    );
  }

  return (
    // 👇 UPDATED: Added light/dark classes for main container
    <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] text-gray-900 dark:text-white p-4 md:p-8 pt-32 md:pt-28 relative transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} /> Back to Orders
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              Order #{order.orderNumber}
              {order.orderStatus === 'Cancelled' && (
                <span className="px-3 py-1 bg-red-100 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 text-sm font-medium rounded-full border flex items-center gap-1">
                  <XCircle size={14} /> Cancelled
                </span>
              )}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
              <Calendar size={14} />
              Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
            </p>
          </div>

          {/* Cancel Button */}
          {order.orderStatus === 'Placed' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <AlertTriangle size={16} />
              Cancel Order
            </button>
          )}
        </div>

        {/* Status Bar */}
        {order.orderStatus !== 'Cancelled' ? (
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 mb-8 overflow-hidden relative shadow-sm dark:shadow-none">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Order Status</h3>
            <div className="relative px-4">
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 dark:bg-white/10 -translate-y-1/2 rounded-full" />
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getProgressWidth(order.orderStatus)}%` }}
                className="absolute top-1/2 left-4 h-1 bg-hyundai-blue -translate-y-1/2 rounded-full z-0"
                style={{ maxWidth: 'calc(100% - 32px)' }}
              />
              <div className="relative z-10 flex justify-between w-full">
                {ORDER_STEPS.map((step) => {
                  const completed = isStepCompleted(step, order.orderStatus);
                  return (
                    <div key={step} className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                        completed 
                          ? 'bg-gray-50 dark:bg-[#050B14] border-hyundai-blue text-hyundai-blue' 
                          : 'bg-gray-50 dark:bg-[#050B14] border-gray-300 dark:border-white/20 text-gray-400 dark:text-gray-500'
                      }`}>
                        {completed ? <CheckCircle size={14} /> : <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full" />}
                      </div>
                      <span className={`text-xs font-medium transition-colors duration-300 ${
                        step === order.orderStatus 
                          ? 'text-gray-900 dark:text-white font-semibold' 
                          : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Cancelled Banner */
          <div className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/10 rounded-2xl p-6 mb-8 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
                <XCircle size={20} />
             </div>
             <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Order Cancelled</h3>
                <p className="text-sm text-red-600 dark:text-red-400/70">
                   This order has been cancelled. Reason: <span className="font-medium italic">"{order.cancellationReason || 'Not specified'}"</span>
                </p>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <Package size={20} className="text-hyundai-blue" /> Items Ordered
              </h3>
              <div className="space-y-4">
                {order.items?.map((item: any, idx: number) => {
                  const imageUrl = getImageUrl(item.image || item.product?.images?.[0]?.url);
                  return (
                    <div key={idx} className="flex gap-4 p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5">
                      <div className="relative w-20 h-20 bg-white dark:bg-white/5 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-0">
                        {imageUrl ? (
                          <Image 
                            src={imageUrl} 
                            alt={item.name || 'Product'} 
                            fill 
                            className="object-cover" 
                            unoptimized={true} 
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
                             <Package size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">Part #: {item.partNumber}</p>
                          </div>
                          <p className="font-bold text-gray-900 dark:text-white">₹{item.subtotal?.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Qty: <span className="text-gray-900 dark:text-white">{item.quantity}</span></p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Price: ₹{item.price?.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="space-y-6">
            {/* Payment Info */}
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <CreditCard size={20} className="text-hyundai-blue" /> Payment Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500 dark:text-gray-400"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400"><span>Tax ({order.taxPercentage}%)</span><span>₹{order.tax?.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400"><span>Shipping</span><span>₹{order.shippingCharges}</span></div>
                <div className="border-t border-gray-200 dark:border-white/10 pt-3 flex justify-between items-end">
                  <span className="text-gray-900 dark:text-white font-medium">Total Amount</span>
                  <span className="text-xl font-bold text-hyundai-blue">₹{order.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="mt-4 p-3 bg-gray-50 dark:bg-black/20 rounded-lg flex justify-between items-center border border-gray-200 dark:border-white/5">
                  <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
                  <span className="font-medium text-gray-900 dark:text-white uppercase bg-white dark:bg-white/10 px-2 py-1 rounded text-xs shadow-sm dark:shadow-none">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <MapPin size={20} className="text-hyundai-blue" /> Shipping Details
              </h3>
              {order.shippingAddress ? (
                <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">{order.user?.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p className="font-mono">{order.shippingAddress.pincode}</p>
                  <p className="mt-3 flex items-center gap-2 text-hyundai-blue pt-2 border-t border-gray-200 dark:border-white/5">
                    <Phone size={14} /> {order.shippingAddress.phone}
                  </p>
                </div>
              ) : <p className="text-gray-500">No address provided</p>}
              
              {order.trackingNumber && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tracking ID</p>
                  <p className="font-mono text-hyundai-blue flex items-center gap-2">
                    <Truck size={14} /> {order.trackingNumber}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🛑 CANCEL CONFIRMATION POPUP WITH REASON INPUT 🛑 */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0A101F] border border-gray-200 dark:border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowCancelModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-500 mb-4 mx-auto">
                <AlertTriangle size={24} />
              </div>

              <h3 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">Cancel Order</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">
                Please provide a reason for cancelling this order.
              </p>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-hyundai-blue mb-4 resize-none h-24 placeholder-gray-400"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border border-transparent dark:border-white/10 rounded-xl text-sm font-semibold text-gray-700 dark:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {cancelling ? (
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  ) : 'Confirm Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}