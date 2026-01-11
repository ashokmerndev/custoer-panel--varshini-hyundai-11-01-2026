// src/components/CartDrawer.tsx
'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import apiClient from '@/services/apiClient';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

export const CartDrawer = () => {
  const { isCartDrawerOpen, toggleCartDrawer, cart, setCart } = useStore();

  useEffect(() => {
    if (isCartDrawerOpen) {
      fetchCart();
    }
  }, [isCartDrawerOpen]);

  const fetchCart = async () => {
    try {
      const response = await apiClient.get('/cart');
      if (response.data.success) {
        setCart(response.data.data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const response = await apiClient.put(`/cart/update/${itemId}`, { quantity });
      if (response.data.success) {
        setCart(response.data.data.cart);
        toast.success('Cart updated');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update cart');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const response = await apiClient.delete(`/cart/remove/${itemId}`);
      if (response.data.success) {
        setCart(response.data.data.cart);
        toast.success('Item removed from cart');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to remove item');
    }
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCartDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white dark:bg-hyundai-obsidian shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-hyundai-blue" size={24} />
                <h2 className="text-2xl font-bold font-display">Your Cart</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCartDrawer}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-6">
              {!cart || cart.items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Add some parts to get started!
                  </p>
                  <Link href="/" onClick={toggleCartDrawer}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-hyundai-blue to-hyundai-midnight text-white rounded-full font-semibold"
                    >
                      Browse Products
                    </motion.button>
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl"
                    >
                      {/* Product image */}
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-200 dark:bg-white/10 flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <Image
                            src = {item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            unoptimized={true}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            🔧
                          </div>
                        )}
                      </div>

                      {/* Product details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {item.product.partNumber}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-hyundai-blue">
                            ₹{item.price}
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item._id, item.quantity - 1);
                                }
                              }}
                              disabled={item.quantity <= 1}
                              className="p-1 rounded-full bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus size={14} />
                            </motion.button>
                            
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="p-1 rounded-full bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus size={14} />
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item._id)}
                              className="p-1 ml-2 rounded-full text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 size={14} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with totals */}
            {cart && cart.items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-white/10 p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-semibold">₹{cart.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax (18%)</span>
                    <span className="font-semibold">₹{cart.tax}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-semibold">
                      {cart.shippingCharges === 0 ? 'FREE' : `₹${cart.shippingCharges}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-white/10">
                    <span>Total</span>
                    <span className="text-hyundai-blue">₹{cart.totalAmount}</span>
                  </div>
                </div>

                <Link href="/checkout" onClick={toggleCartDrawer}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-hyundai-blue to-hyundai-midnight text-white rounded-xl font-semibold text-lg shadow-lg"
                  >
                    Proceed to Checkout
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
