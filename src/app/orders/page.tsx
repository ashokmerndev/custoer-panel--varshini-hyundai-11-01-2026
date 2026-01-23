// src/app/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  Clock,
  MapPin,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import apiClient from "@/services/apiClient";
import socketService from "@/services/socketService";
import toast from "react-hot-toast";

// Helper to fix image URLs
const getImageUrl = (imagePath: string | undefined) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
  return `${baseUrl}/${cleanPath}`;
};

// Updated Interfaces
interface OrderItem {
  product: {
    _id: string;
    name: string;
    partNumber: string;
    images?: Array<{ url: string; publicId: string }>;
  };
  name?: string;
  image?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: "Placed" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Completed" | "Failed";
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber?: string;
  createdAt: string;
}

export default function OrdersPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      fetchOrders();
      setupSocketListeners();
    }

    return () => {
      // Cleanup if needed
    };
  }, [authLoading, isAuthenticated, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/orders");

      if (response.data.success) {
        const ordersData = Array.isArray(response.data.data)
          ? response.data.data
          : response.data.orders || [];

        setOrders(ordersData);
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    if (socketService.onOrderStatusUpdated) {
      socketService.onOrderStatusUpdated((data: any) => {
        console.log("Order status updated:", data);
        toast.success(`Order ${data.orderNumber} status: ${data.orderStatus}`);
        fetchOrders();
      });
    }
  };

  const handleDownloadInvoice = async (
    orderId: string,
    orderNumber: string,
  ) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}/invoice`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Invoice downloaded successfully");
    } catch (error: any) {
      toast.error("Failed to download invoice");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Placed:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30",
      Packed:
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30",
      Shipped:
        "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30",
      Delivered:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30",
      Cancelled:
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400"
    );
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      Placed: <Clock size={14} className="mr-1" />,
      Packed: <Package size={14} className="mr-1" />,
      Shipped: <Truck size={14} className="mr-1" />,
      Delivered: <CheckCircle size={14} className="mr-1" />,
      Cancelled: <XCircle size={14} className="mr-1" />,
    };
    return icons[status] || <Package size={14} className="mr-1" />;
  };

  if (authLoading || loading) {
    return <LoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    // 👇 UPDATED: Added light/dark classes for main container
    <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] text-gray-900 dark:text-white p-4 md:p-8 pt-24 pt-[70px] md:pt-[80px] lg:pt-[90px] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-hyundai-blue to-blue-400 mb-2">
              Order History
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Track and manage your recent purchases
            </p>
          </motion.div>
        </div>

        {/* Content */}
        <div>
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#FFFFFF0D] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-none"
            >
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                No orders yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
                It looks like you haven't placed any orders yet. Start shopping
                to see your history here.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-gradient-to-r from-hyundai-blue to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all"
              >
                Start Shopping
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-hyundai-blue/30 dark:hover:border-white/20 transition-all shadow-sm hover:shadow-md dark:shadow-none"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          #{order.orderNumber}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center ${getStatusColor(order.orderStatus)}`}
                        >
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          order.paymentStatus === "Completed"
                            ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                            : "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20"
                        }`}
                      >
                        Payment: {order.paymentStatus}
                      </span>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Total Amount
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          ₹{order.totalAmount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items Column */}
                    <div className="lg:col-span-2 space-y-4">
                      {order.items?.slice(0, 2).map((item, idx) => {
                        const imageUrl = getImageUrl(
                          item.image || item.product?.images?.[0]?.url,
                        );
                        const itemName =
                          item.name || item.product?.name || "Product";

                        return (
                          <div
                            key={idx}
                            className="flex gap-4 items-center bg-gray-50 dark:bg-black/20 p-3 rounded-xl border border-gray-200 dark:border-white/5"
                          >
                            <div className="relative w-16 h-16 bg-white dark:bg-white/5 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-0">
                              {imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={itemName}
                                  fill
                                  className="object-cover"
                                  unoptimized={true}
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
                                  <AlertCircle size={20} />
                                </div>
                              )}
                            </div>
                            <div className="flex-grow">
                              <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                {itemName}
                              </p>
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Qty: {item.quantity}
                                </p>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  ₹{item.price?.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {order.items?.length > 2 && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 pl-2">
                          +{order.items.length - 2} more items
                        </p>
                      )}
                    </div>

                    {/* Details Column */}
                    <div className="lg:col-span-1 space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                        <CreditCard
                          size={16}
                          className="text-hyundai-blue mt-0.5"
                        />
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Payment Method
                          </p>
                          <p className="font-medium text-gray-900 dark:text-gray-200 uppercase">
                            {order.paymentMethod}
                          </p>
                        </div>
                      </div>

                      {order.shippingAddress && (
                        <div className="flex items-start gap-3">
                          <MapPin
                            size={16}
                            className="text-hyundai-blue mt-0.5"
                          />
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">
                              Delivery Address
                            </p>
                            <p className="font-medium text-gray-900 dark:text-gray-200 line-clamp-2">
                              {order.shippingAddress.street},{" "}
                              {order.shippingAddress.city}
                            </p>
                          </div>
                        </div>
                      )}

                      {order.trackingNumber && (
                        <div className="flex items-start gap-3">
                          <Truck
                            size={16}
                            className="text-hyundai-blue mt-0.5"
                          />
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">
                              Tracking Number
                            </p>
                            <p className="font-mono text-gray-900 dark:text-gray-200">
                              {order.trackingNumber}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Footer Actions */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/orders/${order._id}`)}
                      className="px-4 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-transparent hover:bg-gray-100 dark:hover:bg-white/20 text-gray-700 dark:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View Details
                    </motion.button>

                    {order.paymentStatus === "Completed" && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          handleDownloadInvoice(order._id, order.orderNumber)
                        }
                        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-hyundai-blue/20 dark:hover:bg-hyundai-blue/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Download size={16} />
                        Invoice
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] p-4 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 dark:bg-white/5 rounded-lg mb-2 animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-white dark:bg-white/5 rounded-2xl animate-pulse border border-gray-200 dark:border-white/5"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
