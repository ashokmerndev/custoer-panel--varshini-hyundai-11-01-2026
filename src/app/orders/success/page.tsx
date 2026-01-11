// src/app/orders/success/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle,
  Package,
  ArrowRight,
  Home,
  Sparkles,
  Loader2
} from 'lucide-react';
import Confetti from 'react-confetti';
import apiClient from '@/services/apiClient'; // 👈 Import API Client

// Component using SearchParams needs to be wrapped or separated
function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  console.log(orderId)
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  // New State for Order Details
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 6000);

    // 👇 FETCH ORDER DETAILS FROM BACKEND
    if (orderId) {
      fetchOrderDetails(orderId);
    }

    return () => clearTimeout(timer);
  }, [orderId]);

  const fetchOrderDetails = async (id: string) => {
    setLoading(true);
    try {
      // 🔗 Backend Link: GET /api/orders/:id
      const response = await apiClient.get(`/orders/${id}`);
      if (response.data.success) {
        setOrderDetails(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch order details", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-white flex flex-col items-center justify-center p-4 pt-24 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            colors={['#00AAD2', '#002C5F', '#D4AF37', '#00F0FF', '#C0C0C0']}
          />
        </div>
      )}

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="mb-8 flex justify-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="rounded-full bg-green-500/20 p-6 ring-4 ring-green-500/10"
          >
            <CheckCircle size={80} className="text-green-400 drop-shadow-lg" />
          </motion.div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-400 text-lg">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </motion.div>

        {/* Order Details Card */}
        {orderId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-hyundai-blue/20 rounded-lg">
                  <Package className="text-hyundai-blue" size={24} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Order ID</p>
                  <p className="font-mono text-white font-medium">{orderId}</p>
                </div>
              </div>
            </div>

            {loading ? (
               <div className="flex justify-center py-4">
                 <Loader2 className="animate-spin text-hyundai-blue" />
               </div>
            ) : orderDetails ? (
              // Show actual details if fetched
              <div className="space-y-3 text-left">
                 <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-400">Total Amount:</span>
                    <span className="text-xl font-bold text-white">₹{orderDetails.totalAmount?.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-400">Items:</span>
                    <span className="text-white">{orderDetails.items?.length} items</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Payment:</span>
                    <span className="text-green-400 font-medium">{orderDetails.paymentMethod}</span>
                 </div>
              </div>
            ) : (
              // Fallback static text
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-gray-300 bg-black/20 p-3 rounded-lg">
                  <Sparkles size={18} className="text-yellow-400 flex-shrink-0" />
                  <p className="text-sm">You'll receive a confirmation email shortly</p>
                </div>
                <div className="flex items-center gap-3 text-gray-300 bg-black/20 p-3 rounded-lg">
                  <Package size={18} className="text-blue-400 flex-shrink-0" />
                  <p className="text-sm">Track your order status in real-time</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/orders')}
            className="px-8 py-3.5 bg-gradient-to-r from-hyundai-blue to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <Package size={20} />
            View My Orders
            <ArrowRight size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
            className="px-8 py-3.5 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Continue Shopping
          </motion.button>
        </motion.div>

        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050B14] flex items-center justify-center pt-24 text-white">
        <div className="w-8 h-8 border-2 border-hyundai-blue border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}