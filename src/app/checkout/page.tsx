// // src/app/checkout/page.tsx
// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import { useStore } from "@/store/useStore";
// import { useAuth } from "@/hooks/useAuth";
// import apiClient from "@/services/apiClient";
// import toast from "react-hot-toast";
// import {
//   MapPin,
//   Plus,
//   CreditCard,
//   Package,
//   Tag,
//   Truck,
//   CheckCircle,
//   Loader2,
//   Home,
//   Building,
//   Wallet,
//   DollarSign,
//   AlertCircle,
// } from "lucide-react";
// import { AddAddressModal } from "@/components/checkout/AddAddressModal";
// import styles from "./page.module.css";

// // ==================== TYPE DEFINITIONS ====================
// interface Address {
//   _id: string;
//   addressType: string;
//   street: string;
//   city: string;
//   state: string;
//   pincode: string;
//   isDefault: boolean;
// }

// interface OrderResponse {
//   success: boolean;
//   data: {
//     order: {
//       _id: string;
//       orderNumber: string;
//       totalAmount: number;
//       paymentMethod: string;
//     };
//   };
// }

// interface RazorpayOrderResponse {
//   success: boolean;
//   data: {
//     razorpayOrderId: string;
//     amount: number;
//     keyId: string;
//     currency: string;
//   };
// }

// interface RazorpayResponse {
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// }

// type PaymentMethod = "Razorpay" | "COD";

// // Extend Window interface for Razorpay
// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// // ==================== MAIN COMPONENT ====================
// export default function CheckoutPage() {
//   const router = useRouter();
//   const { user, isAuthenticated, loading: authLoading } = useAuth();
//   const { cart, setCart } = useStore();

//   // State management
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [selectedAddressId, setSelectedAddressId] = useState<string>("");
//   const [selectedPaymentMethod, setSelectedPaymentMethod] =
//     useState<PaymentMethod>("Razorpay");
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
//   const [razorpayLoaded, setRazorpayLoaded] = useState(false);
//   const [scriptError, setScriptError] = useState(false);

//   // ==================== EFFECTS ====================
//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       toast.error("Please login to continue");
//       router.push("/login");
//       return;
//     }

//     if (!authLoading && isAuthenticated && (!cart || cart.items.length === 0)) {
//       toast.error("Your cart is empty");
//       router.push("/cart");
//       return;
//     }

//     if (isAuthenticated && cart && cart.items.length > 0) {
//       fetchAddresses();
//       loadRazorpayScript();
//     }
//   }, [authLoading, isAuthenticated, cart, router]);

//   // ==================== RAZORPAY SCRIPT LOADING ====================
//   const loadRazorpayScript = useCallback(() => {
//     if (window.Razorpay) {
//       setRazorpayLoaded(true);
//       return;
//     }

//     const existingScript = document.querySelector('script[src*="razorpay"]');
//     if (existingScript) {
//       existingScript.addEventListener("load", () => {
//         setRazorpayLoaded(true);
//       });
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;

//     script.onload = () => {
//       setRazorpayLoaded(true);
//       setScriptError(false);
//     };

//     script.onerror = () => {
//       setScriptError(true);
//       setRazorpayLoaded(false);
//       toast.error("Failed to load payment gateway");
//     };

//     document.body.appendChild(script);
//   }, []);

//   // ==================== FETCH ADDRESSES ====================
//   const fetchAddresses = async () => {
//     setLoading(true);
//     try {
//       const response = await apiClient.get("/auth/profile");
//       if (response.data.success) {
//         const userAddresses = response.data.data.user.addresses || [];
//         setAddresses(userAddresses);

//         const defaultAddress = userAddresses.find(
//           (addr: Address) => addr.isDefault,
//         );
//         if (defaultAddress) {
//           setSelectedAddressId(defaultAddress._id);
//         } else if (userAddresses.length > 0) {
//           setSelectedAddressId(userAddresses[0]._id);
//         }
//       }
//     } catch (error: any) {
//       console.error("Error fetching addresses:", error);
//       toast.error("Failed to load addresses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== ADDRESS HANDLERS ====================
//   const handleAddressAdded = useCallback(() => {
//     setShowAddAddressModal(false);
//     fetchAddresses();
//     toast.success("Address added successfully");
//   }, []);

//   // ==================== COD PAYMENT HANDLER ====================
//   const handleCODPayment = async () => {
//     // 1. Basic Validations
//     if (!selectedAddressId) {
//       toast.error("Please select a delivery address");
//       return;
//     }

//     if (!cart) {
//       toast.error("Cart is empty");
//       return;
//     }

//     setProcessing(true);

//     try {
//       const orderPayload = {
//         shippingAddressId: selectedAddressId,
//         paymentMethod: "COD",
//       };

//       // 2. API Call (Renamed response to prevent confusion)
//       // Axios returns the actual backend JSON inside the 'data' property
//       const response = await apiClient.post("/orders", orderPayload);

//       // response.data is your actual API JSON: { success: true, data: { order: ... } }
//       const apiResponse = response.data;

//       console.log("Full API Response:", apiResponse);

//       // 3. Check Success Flag
//       if (!apiResponse.success) {
//         throw new Error(apiResponse.message || "Failed to create order");
//       }

//       // 4. Correct Data Extraction
//       // Path: apiResponse -> data -> order -> _id
//       const orderId = apiResponse.data?.order?._id;

//       if (!orderId) {
//         throw new Error("Order ID missing in response");
//       }

//       // 5. Success Handling
//       //setCart(null);
//       toast.success(apiResponse.message || "Order placed successfully!");
//       router.push(`/orders/success?orderId=${orderId}`);
//     } catch (error: any) {
//       console.error("COD Payment error:", error);

//       // 6. Improved Error Message Handling
//       // Usually backend sends error message in 'message' field, similar to success
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to place order";

//       toast.error(errorMessage);
//     } finally {
//       setProcessing(false);
//     }
//   };
//   // ==================== RAZORPAY PAYMENT HANDLER ====================
//   // const handleRazorpayPayment = async () => {
//   //   if (!selectedAddressId) {
//   //     toast.error("Please select a delivery address");
//   //     return;
//   //   }

//   //   if (!razorpayLoaded || scriptError) {
//   //     toast.error("Payment gateway not ready. Please refresh.");
//   //     return;
//   //   }

//   //   if (!cart) {
//   //     toast.error("Cart is empty");
//   //     return;
//   //   }

//   //   setProcessing(true);

//   //   try {
//   //     const orderPayload = {
//   //       shippingAddressId: selectedAddressId,
//   //       paymentMethod: "Razorpay",
//   //     };

//   //     //const orderResponse: OrderResponse = await apiClient.post('/orders', orderPayload);
//   //     // Remove ': OrderResponse' and add '<OrderResponse>' after post
//   //     const orderResponse = await apiClient.post<OrderResponse>(
//   //       "/orders",
//   //       orderPayload,
//   //     );

//   //     if (!orderResponse.data.success) {
//   //       throw new Error("Failed to create order");
//   //     }

//   //     const orderId = orderResponse.data.data.order._id;
//   //     const orderNumber = orderResponse.data.data.order.orderNumber;

//   //     const razorpayPayload = { orderId: orderId };

//   //     // const razorpayResponse: RazorpayOrderResponse = await apiClient.post(
//   //     //   '/payments/create-razorpay-order',
//   //     //   razorpayPayload
//   //     // );
//   //     const razorpayResponse = await apiClient.post<RazorpayOrderResponse>(
//   //       "/payments/create-razorpay-order",
//   //       razorpayPayload,
//   //     );

//   //     if (!razorpayResponse.data.success) {
//   //       throw new Error("Failed to initialize payment");
//   //     }

//   //     const { razorpayOrderId, amount, keyId, currency } =
//   //       razorpayResponse.data.data;

//   //     const options = {
//   //       key: keyId,
//   //       amount: amount,
//   //       currency: currency,
//   //       name: "Hyundai Spares",
//   //       description: `Order #${orderNumber}`,
//   //       order_id: razorpayOrderId,
//   //       handler: async (response: RazorpayResponse) => {
//   //         try {
//   //           const verifyPayload = {
//   //             razorpayOrderId: response.razorpay_order_id,
//   //             razorpayPaymentId: response.razorpay_payment_id,
//   //             razorpaySignature: response.razorpay_signature,
//   //             orderId: orderId,
//   //           };

//   //           const verifyResponse = await apiClient.post(
//   //             "/payments/verify-razorpay-payment",
//   //             verifyPayload,
//   //           );

//   //           if (verifyResponse.data.success) {
//   //             setCart(null);
//   //             toast.success("Payment successful!");
//   //             router.push(`/orders/success?orderId=${orderId}`);
//   //           } else {
//   //             throw new Error("Payment verification failed");
//   //           }
//   //         } catch (verifyError: any) {
//   //           console.error("Payment verification error:", verifyError);
//   //           toast.error(
//   //             "Payment verification failed. Contact support with Order ID: " +
//   //               orderNumber,
//   //           );
//   //           setTimeout(() => router.push("/orders"), 3000);
//   //         }
//   //       },
//   //       prefill: {
//   //         name: user?.name || "",
//   //         email: user?.email || "",
//   //         contact: user?.phone || "",
//   //       },
//   //       theme: {
//   //         color: "#00AAD2",
//   //       },
//   //       modal: {
//   //         ondismiss: () => {
//   //           setProcessing(false);
//   //           toast.error("Payment cancelled");
//   //           setTimeout(() => router.push("/orders"), 2000);
//   //         },
//   //       },
//   //     };

//   //     const razorpay = new window.Razorpay(options);

//   //     razorpay.on("payment.failed", (response: any) => {
//   //       console.error("Payment failed:", response.error);
//   //       setProcessing(false);
//   //       toast.error(`Payment failed: ${response.error.description}`);
//   //       setTimeout(() => router.push("/orders"), 2000);
//   //     });

//   //     razorpay.open();
//   //     setProcessing(false);
//   //   } catch (error: any) {
//   //     console.error("Payment error:", error);
//   //     const errorMessage = error.response?.data?.error || "Payment failed";
//   //     toast.error(errorMessage);
//   //     setProcessing(false);
//   //   }
//   // };

//   // ==================== UNIFIED PAYMENT HANDLER ====================
//   const handlePayment = () => {
//     if (selectedPaymentMethod === "COD") {
//       handleCODPayment();
//     } else {
//       // handleRazorpayPayment();
//     }
//   };

//   // ==================== LOADING STATE ====================
//   if (authLoading || loading) {
//     return <LoadingSkeleton />;
//   }

//   if (!isAuthenticated || !cart) {
//     return null;
//   }

//   // ==================== RENDER ====================
//   return (
//     <div className={styles.container}>
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className={styles.header}
//       >
//         <h1 className={styles.title}>Checkout</h1>
//         <p className={styles.subtitle}>Complete your order securely</p>
//       </motion.div>

//       <div className={styles.content}>
//         <div className={styles.leftColumn}>
//           {/* Address Section */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className={styles.section}
//           >
//             <div className={styles.sectionHeader}>
//               <MapPin className="text-hyundai-blue" size={24} />
//               <h2 className={styles.sectionTitle}>Delivery Address</h2>
//             </div>

//             {addresses.length === 0 ? (
//               <div className={styles.noAddresses}>
//                 <MapPin size={48} className="text-gray-500 mb-4" />
//                 <p className="text-gray-600 dark:text-gray-400 mb-4">
//                   No saved addresses. Add one to continue.
//                 </p>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setShowAddAddressModal(true)}
//                   className={styles.addAddressButton}
//                 >
//                   <Plus size={20} />
//                   Add Delivery Address
//                 </motion.button>
//               </div>
//             ) : (
//               <>
//                 <div className={styles.addressList}>
//                   {addresses.map((address, index) => (
//                     <motion.div
//                       key={address._id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       onClick={() => setSelectedAddressId(address._id)}
//                       className={`${styles.addressCard} ${
//                         selectedAddressId === address._id
//                           ? styles.addressCardSelected
//                           : ""
//                       }`}
//                     >
//                       {selectedAddressId === address._id && (
//                         <motion.div
//                           initial={{ scale: 0 }}
//                           animate={{ scale: 1 }}
//                           className={styles.selectedBadge}
//                         >
//                           <CheckCircle size={20} />
//                         </motion.div>
//                       )}

//                       <div className={styles.addressType}>
//                         {address.addressType === "Home" ? (
//                           <Home size={20} />
//                         ) : (
//                           <Building size={20} />
//                         )}
//                         <span>{address.addressType}</span>
//                         {address.isDefault && (
//                           <span className={styles.defaultBadge}>Default</span>
//                         )}
//                       </div>

//                       <div className={styles.addressDetails}>
//                         <p>{address.street}</p>
//                         <p>
//                           {address.city}, {address.state}
//                         </p>
//                         <p>PIN: {address.pincode}</p>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => setShowAddAddressModal(true)}
//                   className={styles.addNewButton}
//                 >
//                   <Plus size={18} />
//                   Add New Address
//                 </motion.button>
//               </>
//             )}
//           </motion.div>

//           {/* Payment Method Section */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className={styles.section}
//           >
//             <div className={styles.sectionHeader}>
//               <CreditCard className="text-hyundai-blue" size={24} />
//               <h2 className={styles.sectionTitle}>Payment Method</h2>
//             </div>

//             <div className={styles.paymentMethods}>
//               <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 onClick={() => setSelectedPaymentMethod("Razorpay")}
//                 className={`${styles.paymentCard} ${
//                   selectedPaymentMethod === "Razorpay"
//                     ? styles.paymentCardSelected
//                     : ""
//                 }`}
//               >
//                 {selectedPaymentMethod === "Razorpay" && (
//                   <div className={styles.paymentSelectedBadge}>
//                     <CheckCircle size={20} />
//                   </div>
//                 )}
//                 <Wallet size={32} className="text-hyundai-blue mb-2" />
//                 <h3 className={styles.paymentTitle}>Online Payment</h3>
//                 <p className={styles.paymentDescription}>
//                   Pay with Card, UPI, Net Banking
//                 </p>
//                 {!razorpayLoaded && selectedPaymentMethod === "Razorpay" && (
//                   <div className="flex items-center gap-2 mt-2 text-xs text-yellow-500">
//                     <AlertCircle size={14} />
//                     <span>Loading...</span>
//                   </div>
//                 )}
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 onClick={() => setSelectedPaymentMethod("COD")}
//                 className={`${styles.paymentCard} ${
//                   selectedPaymentMethod === "COD"
//                     ? styles.paymentCardSelected
//                     : ""
//                 }`}
//               >
//                 {selectedPaymentMethod === "COD" && (
//                   <div className={styles.paymentSelectedBadge}>
//                     <CheckCircle size={20} />
//                   </div>
//                 )}
//                 <DollarSign size={32} className="text-green-500 mb-2" />
//                 <h3 className={styles.paymentTitle}>Cash on Delivery</h3>
//                 <p className={styles.paymentDescription}>
//                   Pay when you receive
//                 </p>
//               </motion.div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Order Summary */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//           className={styles.orderSummary}
//         >
//           <h2 className={styles.summaryTitle}>Order Summary</h2>

//           <div className={styles.itemsPreview}>
//             <p className={styles.itemsCount}>
//               {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
//             </p>
//             <div className={styles.itemsList}>
//               {cart.items.slice(0, 3).map((item) => (
//                 <div key={item._id} className={styles.itemRow}>
//                   <span className={styles.itemName}>
//                     {item.product.name} × {item.quantity}
//                   </span>
//                   <span className={styles.itemPrice}>₹{item.subtotal}</span>
//                 </div>
//               ))}
//               {cart.items.length > 3 && (
//                 <p className={styles.moreItems}>
//                   +{cart.items.length - 3} more
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className={styles.priceBreakdown}>
//             <div className={styles.priceRow}>
//               <span className={styles.priceLabel}>
//                 <Package size={16} />
//                 Subtotal
//               </span>
//               <span className={styles.priceValue}>₹{cart.subtotal}</span>
//             </div>

//             <div className={styles.priceRow}>
//               <span className={styles.priceLabel}>
//                 <Tag size={16} />
//                 GST (18%)
//               </span>
//               <span className={styles.priceValue}>₹{cart.tax}</span>
//             </div>

//             <div className={styles.priceRow}>
//               <span className={styles.priceLabel}>
//                 <Truck size={16} />
//                 Shipping
//               </span>
//               <span className={styles.priceValue}>
//                 {cart.shippingCharges === 0 ? (
//                   <span className="text-green-500">FREE</span>
//                 ) : (
//                   `₹${cart.shippingCharges}`
//                 )}
//               </span>
//             </div>

//             <div className={styles.divider} />

//             <div className={styles.totalRow}>
//               <span>Total</span>
//               <span className={styles.totalAmount}>₹{cart.totalAmount}</span>
//             </div>
//           </div>

//           <motion.button
//             whileHover={{ scale: processing ? 1 : 1.02 }}
//             whileTap={{ scale: processing ? 1 : 0.98 }}
//             onClick={handlePayment}
//             disabled={
//               processing || !selectedAddressId || addresses.length === 0
//             }
//             className={styles.paymentButton}
//           >
//             {processing ? (
//               <>
//                 <Loader2 size={20} className="animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 {selectedPaymentMethod === "Razorpay" ? (
//                   <>
//                     <CreditCard size={20} />
//                     Pay ₹{cart.totalAmount}
//                   </>
//                 ) : (
//                   <>
//                     <DollarSign size={20} />
//                     Place Order (COD)
//                   </>
//                 )}
//               </>
//             )}
//           </motion.button>

//           <div className={styles.securityBadge}>
//             <CheckCircle size={16} className="text-green-500" />
//             <span>
//               {selectedPaymentMethod === "Razorpay"
//                 ? "Secure payment by Razorpay"
//                 : "Safe Cash on Delivery"}
//             </span>
//           </div>
//         </motion.div>
//       </div>

//       <AnimatePresence>
//         {showAddAddressModal && (
//           <AddAddressModal
//             onClose={() => setShowAddAddressModal(false)}
//             onSuccess={handleAddressAdded}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// function LoadingSkeleton() {
//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <div className="h-12 w-48 skeleton mb-2" />
//         <div className="h-6 w-64 skeleton" />
//       </div>
//       <div className={styles.content}>
//         <div className={styles.leftColumn}>
//           <div
//             className={`${styles.section} skeleton`}
//             style={{ height: "400px" }}
//           />
//           <div
//             className={`${styles.section} skeleton`}
//             style={{ height: "300px" }}
//           />
//         </div>
//         <div
//           className={`${styles.orderSummary} skeleton`}
//           style={{ height: "500px" }}
//         />
//       </div>
//     </div>
//   );
// }

// src/app/checkout/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";
import {
  MapPin,
  Plus,
  CreditCard,
  Package,
  Tag,
  Truck,
  CheckCircle,
  Loader2,
  Home,
  Building,
  Wallet,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { AddAddressModal } from "@/components/checkout/AddAddressModal";
import styles from "./page.module.css";

// ==================== TYPE DEFINITIONS ====================
interface Address {
  _id: string;
  addressType: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface OrderResponse {
  success: boolean;
  data: {
    order: {
      _id: string;
      orderNumber: string;
      totalAmount: number;
      paymentMethod: string;
    };
  };
}

interface RazorpayOrderResponse {
  success: boolean;
  data: {
    razorpayOrderId: string;
    amount: number;
    keyId: string;
    currency: string;
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

type PaymentMethod = "Razorpay" | "COD";

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

// ==================== MAIN COMPONENT ====================
export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { cart, setCart } = useStore();

  // State management
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("Razorpay");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  // ==================== EFFECTS ====================
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }

    if (!authLoading && isAuthenticated && (!cart || cart.items.length === 0)) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    if (isAuthenticated && cart && cart.items.length > 0) {
      fetchAddresses();
      loadRazorpayScript();
    }
  }, [authLoading, isAuthenticated, cart, router]);

  // ==================== RAZORPAY SCRIPT LOADING ====================
  const loadRazorpayScript = useCallback(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="razorpay"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        setRazorpayLoaded(true);
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      setRazorpayLoaded(true);
      setScriptError(false);
    };

    script.onerror = () => {
      setScriptError(true);
      setRazorpayLoaded(false);
      toast.error("Failed to load payment gateway");
    };

    document.body.appendChild(script);
  }, []);

  // ==================== FETCH ADDRESSES ====================
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/auth/profile");
      if (response.data.success) {
        const userAddresses = response.data.data.user.addresses || [];
        setAddresses(userAddresses);

        const defaultAddress = userAddresses.find(
          (addr: Address) => addr.isDefault,
        );
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        } else if (userAddresses.length > 0) {
          setSelectedAddressId(userAddresses[0]._id);
        }
      }
    } catch (error: any) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  // ==================== ADDRESS HANDLERS ====================
  const handleAddressAdded = useCallback(() => {
    setShowAddAddressModal(false);
    fetchAddresses();
    toast.success("Address added successfully");
  }, []);

  // ==================== COD PAYMENT HANDLER ====================
  const handleCODPayment = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!cart) {
      toast.error("Cart is empty");
      return;
    }

    setProcessing(true);

    try {
      const orderPayload = {
        shippingAddressId: selectedAddressId,
        paymentMethod: "COD",
      };

      const response = await apiClient.post("/orders", orderPayload);
      const apiResponse = response.data;

      console.log("Full API Response:", apiResponse);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to create order");
      }

      const orderId = apiResponse.data?.order?._id;

      if (!orderId) {
        throw new Error("Order ID missing in response");
      }

      toast.success(apiResponse.message || "Order placed successfully!");
      router.push(`/orders/success?orderId=${orderId}`);
    } catch (error: any) {
      console.error("COD Payment error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to place order";

      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  // ==================== UNIFIED PAYMENT HANDLER ====================
  const handlePayment = () => {
    if (selectedPaymentMethod === "COD") {
      handleCODPayment();
    } else {
      // handleRazorpayPayment();
      toast.error("Online payment integration pending"); // Temporary placeholder
    }
  };

  // ==================== LOADING STATE ====================
  if (authLoading || loading) {
    return <LoadingSkeleton />;
  }

  if (!isAuthenticated || !cart) {
    return null;
  }

  // ==================== RENDER ====================
  return (
    <div
      className={`${styles.container} bg-gray-50 dark:bg-black min-h-screen`}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.header}
      >
        <h1
          className={`${styles.title} text-3xl font-bold text-gray-900 dark:text-white`}
        >
          Checkout
        </h1>
        <p
          className={`${styles.subtitle} text-gray-600 dark:text-gray-400 mt-2`}
        >
          Complete your order securely
        </p>
      </motion.div>

      <div className={styles.content}>
        <div className={styles.leftColumn}>
          {/* Address Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${styles.section} bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800`}
          >
            <div className={styles.sectionHeader}>
              <MapPin className="text-blue-600 dark:text-blue-400" size={24} />
              <h2
                className={`${styles.sectionTitle} text-xl font-bold text-gray-900 dark:text-white`}
              >
                Delivery Address
              </h2>
            </div>

            {addresses.length === 0 ? (
              <div className={styles.noAddresses}>
                <MapPin size={48} className="text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No saved addresses. Add one to continue.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddAddressModal(true)}
                  className={`${styles.addAddressButton} bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400`}
                >
                  <Plus size={20} />
                  Add Delivery Address
                </motion.button>
              </div>
            ) : (
              <>
                <div className={styles.addressList}>
                  {addresses.map((address, index) => (
                    <motion.div
                      key={address._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedAddressId(address._id)}
                      className={`${styles.addressCard} border rounded-xl p-4 cursor-pointer relative transition-all ${
                        selectedAddressId === address._id
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-400"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 bg-white dark:bg-transparent"
                      }`}
                    >
                      {selectedAddressId === address._id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 text-blue-600 dark:text-blue-400"
                        >
                          <CheckCircle size={20} />
                        </motion.div>
                      )}

                      <div className="flex items-center gap-2 mb-2">
                        {address.addressType === "Home" ? (
                          <Home
                            size={18}
                            className="text-gray-500 dark:text-gray-400"
                          />
                        ) : (
                          <Building
                            size={18}
                            className="text-gray-500 dark:text-gray-400"
                          />
                        )}
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {address.addressType}
                        </span>
                        {address.isDefault && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <p>{address.street}</p>
                        <p>
                          {address.city}, {address.state}
                        </p>
                        <p className="font-medium">PIN: {address.pincode}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddAddressModal(true)}
                  className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Plus size={18} />
                  Add New Address
                </motion.button>
              </>
            )}
          </motion.div>

          {/* Payment Method Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`${styles.section} bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800`}
          >
            <div className={styles.sectionHeader}>
              <CreditCard
                className="text-blue-600 dark:text-blue-400"
                size={24}
              />
              <h2
                className={`${styles.sectionTitle} text-xl font-bold text-gray-900 dark:text-white`}
              >
                Payment Method
              </h2>
            </div>

            <div className={styles.paymentMethods}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPaymentMethod("Razorpay")}
                className={`${styles.paymentCard} border rounded-xl p-4 cursor-pointer relative transition-all ${
                  selectedPaymentMethod === "Razorpay"
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-400"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent"
                }`}
              >
                {selectedPaymentMethod === "Razorpay" && (
                  <div className="absolute top-4 right-4 text-blue-600 dark:text-blue-400">
                    <CheckCircle size={20} />
                  </div>
                )}
                <Wallet
                  size={32}
                  className="text-blue-600 dark:text-blue-400 mb-3"
                />
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Online Payment
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pay with Card, UPI, Net Banking
                </p>
                {!razorpayLoaded && selectedPaymentMethod === "Razorpay" && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-yellow-600 dark:text-yellow-500">
                    <AlertCircle size={14} />
                    <span>Loading...</span>
                  </div>
                )}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPaymentMethod("COD")}
                className={`${styles.paymentCard} border rounded-xl p-4 cursor-pointer relative transition-all ${
                  selectedPaymentMethod === "COD"
                    ? "border-green-500 bg-green-50/50 dark:bg-green-900/10 dark:border-green-400"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent"
                }`}
              >
                {selectedPaymentMethod === "COD" && (
                  <div className="absolute top-4 right-4 text-green-600 dark:text-green-400">
                    <CheckCircle size={20} />
                  </div>
                )}
                <DollarSign
                  size={32}
                  className="text-green-600 dark:text-green-400 mb-3"
                />
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Cash on Delivery
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pay when you receive
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`${styles.orderSummary} bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800`}
        >
          <h2
            className={`${styles.summaryTitle} text-xl font-bold text-gray-900 dark:text-white mb-6`}
          >
            Order Summary
          </h2>

          <div className={styles.itemsPreview}>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
            </p>
            <div className="space-y-3 mb-4">
              {cart.items.slice(0, 3).map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-start text-sm"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₹{item.subtotal}
                  </span>
                </div>
              ))}
              {cart.items.length > 3 && (
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer">
                  +{cart.items.length - 3} more items
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Package size={16} />
                Subtotal
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                ₹{cart.subtotal}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Tag size={16} />
                GST (18%)
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                ₹{cart.tax}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Truck size={16} />
                Shipping
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {cart.shippingCharges === 0 ? (
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    FREE
                  </span>
                ) : (
                  `₹${cart.shippingCharges}`
                )}
              </span>
            </div>

            <div className="border-t border-dashed border-gray-200 dark:border-gray-700 my-4" />

            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-blue-600 dark:text-blue-400">
                ₹{cart.totalAmount}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: processing ? 1 : 1.02 }}
            whileTap={{ scale: processing ? 1 : 0.98 }}
            onClick={handlePayment}
            disabled={
              processing || !selectedAddressId || addresses.length === 0
            }
            className={`${styles.paymentButton} w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {processing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {selectedPaymentMethod === "Razorpay" ? (
                  <>
                    <CreditCard size={20} />
                    Pay ₹{cart.totalAmount}
                  </>
                ) : (
                  <>
                    <DollarSign size={20} />
                    Place Order (COD)
                  </>
                )}
              </>
            )}
          </motion.button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <CheckCircle
              size={14}
              className="text-green-600 dark:text-green-500"
            />
            <span>
              {selectedPaymentMethod === "Razorpay"
                ? "Secure payment by Razorpay"
                : "Safe Cash on Delivery"}
            </span>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showAddAddressModal && (
          <AddAddressModal
            onClose={() => setShowAddAddressModal(false)}
            onSuccess={handleAddressAdded}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className={`${styles.container} bg-gray-50 dark:bg-black p-8`}>
      <div className={styles.header}>
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-3" />
        <div className="h-5 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <div
            className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6"
            style={{ height: "400px" }}
          >
            <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>
          <div
            className="bg-white dark:bg-gray-900 rounded-xl p-6"
            style={{ height: "300px" }}
          >
            <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>
        </div>
        <div
          className="bg-white dark:bg-gray-900 rounded-xl p-6"
          style={{ height: "500px" }}
        >
          <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
