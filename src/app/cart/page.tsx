// // src/app/cart/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import {
//   ShoppingCart,
//   Plus,
//   Minus,
//   Trash2,
//   ArrowRight,
//   Package,
//   Tag,
//   Truck,
// } from 'lucide-react';
// import { useStore, Cart as CartType } from '@/store/useStore';
// import apiClient from '@/services/apiClient';
// import toast from 'react-hot-toast';
// import styles from './page.module.css';

// export default function CartPage() {
//   const router = useRouter();
//   const { cart, setCart } = useStore();
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState<string | null>(null);

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     setLoading(true);
//     try {
//       const response = await apiClient.get('/cart');
//       console.log("ashok varmaaaaa",response.data.cart)
//       if (response.data.success) {
//         setCart(response.data.data.cart);
//       }
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuantity = async (itemId: string, quantity: number) => {
//     if (quantity < 1) return;
    
//     setUpdating(itemId);
//     try {
//       const response = await apiClient.put(`/cart/update/${itemId}`, { quantity });
//       if (response.data.success) {
//         setCart(response.data.data.cart);
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || 'Failed to update quantity');
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const removeItem = async (itemId: string) => {
//     setUpdating(itemId);
//     try {
//       const response = await apiClient.delete(`/cart/remove/${itemId}`);
//       if (response.data.success) {
//         setCart(response.data.data.cart);
//         toast.success('Item removed from cart');
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || 'Failed to remove item');
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const clearCart = async () => {
//     if (!confirm('Are you sure you want to clear your cart?')) return;
    
//     try {
//       const response = await apiClient.delete('/cart/clear');
//       if (response.data.success) {
//         setCart(null);
//         toast.success('Cart cleared');
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || 'Failed to clear cart');
//     }
//   };

//   if (loading) {
//     return <LoadingSkeleton />;
//   }

//   if (!cart || cart.items.length === 0) {
//     return (
//       <div className={styles.container}>
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className={styles.emptyState}
//         >
//           <motion.div
//             animate={{
//               scale: [1, 1.1, 1],
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//             }}
//             className="text-8xl mb-4"
//           >
//             🛒
//           </motion.div>
//           <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-8">
//             Add some parts to get started!
//           </p>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => router.push('/')}
//             className={styles.shopButton}
//           >
//             Start Shopping
//           </motion.button>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className={styles.header}
//       >
//         <div className={styles.headerContent}>
//           <ShoppingCart size={32} className="text-hyundai-blue" />
//           <div>
//             <h1 className={styles.title}>Shopping Cart</h1>
//             <p className={styles.subtitle}>
//               {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
//             </p>
//           </div>
//         </div>

//         {cart.items.length > 0 && (
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={clearCart}
//             className={styles.clearButton}
//           >
//             <Trash2 size={18} />
//             Clear Cart
//           </motion.button>
//         )}
//       </motion.div>

//       <div className={styles.content}>
//         {/* Cart Items */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className={styles.cartItems}
//         >
//           {cart.items.map((item, index) => (
//             <motion.div
//               key={item._id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className={styles.cartItem}
//             >
//               {/* Product Image */}
//               <div className={styles.itemImage}>
//                 {item.product.images?.[0]?.url ? (
//                   <Image
//                     src={item.product.images[0].url}
//                     alt={item.product.name}
//                     fill
//                     className="object-cover"
//                     priority={index === 0}
//                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   />
//                 ) : (
//                   <span className="text-4xl">🔧</span>
//                 )}
//               </div>

//               {/* Product Details */}
//               <div className={styles.itemDetails}>
//                 <h3 className={styles.itemName}>{item.product.name}</h3>
//                 <p className={styles.itemPartNumber}>
//                   Part #{item.product.partNumber}
//                 </p>
//                 <div className={styles.itemPrice}>
//                   ₹{item.price}
//                   <span className={styles.itemPriceLabel}>per unit</span>
//                 </div>
//               </div>

//               {/* Quantity Controls */}
//               <div className={styles.quantityControl}>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => updateQuantity(item._id, item.quantity - 1)}
//                   disabled={item.quantity <= 1 || updating === item._id}
//                   className={styles.quantityButton}
//                 >
//                   <Minus size={16} />
//                 </motion.button>
                
//                 <span className={styles.quantity}>{item.quantity}</span>
                
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => updateQuantity(item._id, item.quantity + 1)}
//                   disabled={item.quantity >= item.product.stock || updating === item._id}
//                   className={styles.quantityButton}
//                 >
//                   <Plus size={16} />
//                 </motion.button>
//               </div>

//               {/* Subtotal */}
//               <div className={styles.itemSubtotal}>
//                 ₹{item.subtotal}
//               </div>

//               {/* Remove Button */}
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => removeItem(item._id)}
//                 disabled={updating === item._id}
//                 className={styles.removeButton}
//               >
//                 <Trash2 size={20} />
//               </motion.button>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Order Summary */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//           className={styles.orderSummary}
//         >
//           <h2 className={styles.summaryTitle}>Order Summary</h2>

//           {/* Summary Details */}
//           <div className={styles.summaryDetails}>
//             <div className={styles.summaryRow}>
//               <span className={styles.summaryLabel}>
//                 <Package size={16} />
//                 Subtotal ({cart.totalItems} items)
//               </span>
//               <span className={styles.summaryValue}>₹{cart.subtotal}</span>
//             </div>

//             <div className={styles.summaryRow}>
//               <span className={styles.summaryLabel}>
//                 <Tag size={16} />
//                 GST (18%)
//               </span>
//               <span className={styles.summaryValue}>₹{cart.tax}</span>
//             </div>

//             <div className={styles.summaryRow}>
//               <span className={styles.summaryLabel}>
//                 <Truck size={16} />
//                 Shipping
//               </span>
//               <span className={styles.summaryValue}>
//                 {cart.shippingCharges === 0 ? (
//                   <span className="text-green-500">FREE</span>
//                 ) : (
//                   `₹${cart.shippingCharges}`
//                 )}
//               </span>
//             </div>

//             {cart.subtotal < 5000 && (
//               <div className={styles.shippingNote}>
//                 Add ₹{5000 - cart.subtotal} more to get FREE shipping
//               </div>
//             )}

//             <div className={styles.summaryDivider} />

//             <div className={styles.summaryTotal}>
//               <span>Total Amount</span>
//               <span className={styles.totalAmount}>₹{cart.totalAmount}</span>
//             </div>
//           </div>

//           {/* Checkout Button */}
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => router.push('/checkout')}
//             className={styles.checkoutButton}
//           >
//             <span>Proceed to Checkout</span>
//             <ArrowRight size={20} />
//           </motion.button>

//           {/* Trust Badges */}
//           <div className={styles.trustBadges}>
//             <div className={styles.trustBadge}>
//               <Truck size={20} />
//               <span>Fast Delivery</span>
//             </div>
//             <div className={styles.trustBadge}>
//               <Package size={20} />
//               <span>Genuine Parts</span>
//             </div>
//           </div>

//           {/* Continue Shopping */}
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => router.push('/')}
//             className={styles.continueButton}
//           >
//             Continue Shopping
//           </motion.button>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// function LoadingSkeleton() {
//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <div className={styles.headerContent}>
//           <div className="w-8 h-8 skeleton rounded" />
//           <div>
//             <div className="h-8 w-48 skeleton mb-2" />
//             <div className="h-4 w-32 skeleton" />
//           </div>
//         </div>
//       </div>
//       <div className={styles.content}>
//         <div className={styles.cartItems}>
//           {[1, 2, 3].map((i) => (
//             <div key={i} className={`${styles.cartItem} skeleton`} style={{ height: '150px' }} />
//           ))}
//         </div>
//         <div className={`${styles.orderSummary} skeleton`} style={{ height: '500px' }} />
//       </div>
//     </div>
//   );
// }











'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Package,
  Tag,
  Truck,
  AlertCircle
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import apiClient from '@/services/apiClient';
import toast from 'react-hot-toast';
import styles from './page.module.css';

// --- HELPER FUNCTION: Get Safe Image URL ---
const getProductImage = (product: any) => {
  // 1. Check if product or images array exists
  if (!product || !product.images || !Array.isArray(product.images) || product.images.length === 0) {
    return null;
  }

  // 2. Get the first image object
  const firstImage = product.images[0];
  const url = firstImage?.url;
  console.log('Product Image URL:', url);

  // 3. Validate URL string
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return null;
  }

  // 4. Return full URL directly if it's from Cloudinary (starts with http)
  if (url.startsWith('http')) {
    return url;
  }

  // 5. Handle relative paths (local uploads)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  return `${baseUrl}/${cleanPath}`;
};

export default function CartPage() {
  const router = useRouter();
  const { cart, setCart } = useStore();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/cart');
      if (response.data.success) {
        setCart(response.data.data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setUpdating(itemId);
    try {
      const response = await apiClient.put(`/cart/update/${itemId}`, { quantity });
      if (response.data.success) {
        setCart(response.data.data.cart);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdating(itemId);
    try {
      const response = await apiClient.delete(`/cart/remove/${itemId}`);
      if (response.data.success) {
        setCart(response.data.data.cart);
        toast.success('Item removed from cart');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      const response = await apiClient.delete('/cart/clear');
      if (response.data.success) {
        setCart(null);
        toast.success('Cart cleared');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to clear cart');
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.emptyState}
        >
          <div className="text-8xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Add some parts to get started!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className={styles.shopButton}
          >
            Start Shopping
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <ShoppingCart size={32} className="text-hyundai-blue" />
          <div>
            <h1 className={styles.title}>Shopping Cart</h1>
            <p className={styles.subtitle}>
              {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>

        {cart.items.length > 0 && (
          <button onClick={clearCart} className={styles.clearButton}>
            <Trash2 size={18} />
            Clear Cart
          </button>
        )}
      </div>

      <div className={styles.content}>
        {/* Cart Items */}
        <div className={styles.cartItems}>
          {cart.items.map((item: any, index: number) => {
             console.log(item.product)
            // ✅ FIX: Calculate Image URL safely BEFORE rendering
            const imageUrl = getProductImage(item.product);
            console.log(item.product)
            
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={styles.cartItem}
              >
                {/* Product Image */}
                <div className={styles.itemImage}>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.product?.name || 'Product Image'}
                      fill
                      className="object-cover"
                      priority={index === 0} // Load first image immediately
                      unoptimized={true}     // Important for external URLs (Cloudinary)
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 rounded-lg">
                      <Package size={32} />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.product?.name}</h3>
                  <p className={styles.itemPartNumber}>
                    Part #{item.product?.partNumber || 'N/A'}
                  </p>
                  
                  {item.product?.stock <= 5 && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> Only {item.product.stock} left!
                    </p>
                  )}

                  <div className={styles.itemPrice}>
                    ₹{item.price?.toLocaleString()}
                    <span className={styles.itemPriceLabel}>per unit</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className={styles.quantityControl}>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || updating === item._id}
                    className={styles.quantityButton}
                  >
                    <Minus size={16} />
                  </button>
                  
                  <span className={styles.quantity}>{item.quantity}</span>
                  
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= (item.product?.stock || 999) || updating === item._id}
                    className={styles.quantityButton}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Subtotal */}
                <div className={styles.itemSubtotal}>
                  ₹{item.subtotal?.toLocaleString()}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item._id)}
                  disabled={updating === item._id}
                  className={styles.removeButton}
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className={styles.orderSummary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>

          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>
                <Package size={16} />
                Subtotal ({cart.totalItems} items)
              </span>
              <span className={styles.summaryValue}>₹{cart.subtotal?.toLocaleString()}</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>
                <Tag size={16} />
                GST ({cart.taxPercentage}%)
              </span>
              <span className={styles.summaryValue}>₹{cart.tax?.toLocaleString()}</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>
                <Truck size={16} />
                Shipping
              </span>
              <span className={styles.summaryValue}>
                {cart.shippingCharges === 0 ? (
                  <span className="text-green-500">FREE</span>
                ) : (
                  `₹${cart.shippingCharges}`
                )}
              </span>
            </div>

            {cart.subtotal < 5000 && (
              <div className={styles.shippingNote}>
                Add ₹{(5000 - cart.subtotal).toLocaleString()} more to get FREE shipping
              </div>
            )}

            <div className={styles.summaryDivider} />

            <div className={styles.summaryTotal}>
              <span>Total Amount</span>
              <span className={styles.totalAmount}>₹{cart.totalAmount?.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className={styles.checkoutButton}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={20} />
          </button>

          <div className={styles.trustBadges}>
            <div className={styles.trustBadge}>
              <Truck size={20} />
              <span>Fast Delivery</span>
            </div>
            <div className={styles.trustBadge}>
              <Package size={20} />
              <span>Genuine Parts</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className={styles.continueButton}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className="w-8 h-8 skeleton bg-gray-700/50 rounded" />
          <div>
            <div className="h-8 w-48 skeleton bg-gray-700/50 mb-2" />
            <div className="h-4 w-32 skeleton bg-gray-700/50" />
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.cartItems}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${styles.cartItem} skeleton bg-gray-800/50`} style={{ height: '150px' }} />
          ))}
        </div>
        <div className={`${styles.orderSummary} skeleton bg-gray-800/50`} style={{ height: '500px' }} />
      </div>
    </div>
  );
}