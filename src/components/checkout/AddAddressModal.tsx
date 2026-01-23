"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Building,
  Hash,
  Navigation,
  Briefcase,
  Home,
  User,
  AlertCircle,
} from "lucide-react";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";

interface AddAddressModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface AddressFormData {
  addressType: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

// ఎర్రర్స్ కోసం కొత్త ఇంటర్ఫేస్
interface AddressFormErrors {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    addressType: "Home",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ఎర్రర్స్ ని స్టోర్ చేయడానికి స్టేట్
  const [errors, setErrors] = useState<AddressFormErrors>({});

  // ఫీల్డ్స్ వాలిడేట్ చేసే ఫంక్షన్
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "street":
        if (!value.trim()) return "Street address is required";
        if (value.trim().length < 5) return "Address is too short";
        return "";
      case "city":
        if (!value.trim()) return "City is required";
        return "";
      case "state":
        if (!value.trim()) return "State is required";
        return "";
      case "pincode":
        if (!value.trim()) return "PIN Code is required";
        if (!/^\d{6}$/.test(value)) return "PIN Code must be exactly 6 digits";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Special validation for Pincode: Only allow numbers
    if (name === "pincode") {
      if (!/^\d*$/.test(value)) return; // Don't update if not a number
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name as keyof AddressFormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  // బాక్స్ నుండి బయటకు వచ్చినప్పుడు వాలిడేషన్ (OnBlur)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg || undefined,
    }));
  };

  const setAddressType = (type: string) => {
    setFormData({ ...formData, addressType: type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Submit చేసే ముందు అన్ని ఫీల్డ్స్ చెక్ చేయాలి
    const newErrors: AddressFormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (key !== "addressType") {
        // addressType కి వాలిడేషన్ అవసరం లేదు
        const error = validateField(
          key,
          formData[key as keyof AddressFormData],
        );
        if (error) {
          newErrors[key as keyof AddressFormErrors] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post("/auth/address", formData);
      if (response.data.success) {
        toast.success("Address added successfully!");
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error("Error adding address:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to add address";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function for dynamic border classes based on error state
  const getInputClass = (fieldName: keyof AddressFormErrors) => `
    w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-black/20 border rounded-xl 
    text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all
    ${
      errors[fieldName]
        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
        : "border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
    }
  `;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* 1. Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* 2. Main Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#1a1d29] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-full text-blue-600 dark:text-blue-400">
                <MapPin size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                New Delivery Address
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Address Type Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Address Type
              </label>
              <div className="flex gap-3">
                {["Home", "Work", "Other"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAddressType(type)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                      formData.addressType === type
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30"
                        : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
                    }`}
                  >
                    {type === "Home" && <Home size={16} />}
                    {type === "Work" && <Briefcase size={16} />}
                    {type === "Other" && <Navigation size={16} />}
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="space-y-4">
              {/* Street Address */}
              <div className="space-y-1">
                <div className="relative group">
                  <Building
                    className={`absolute left-4 top-3.5 transition-colors ${errors.street ? "text-red-500" : "text-gray-400 group-focus-within:text-blue-500"}`}
                    size={18}
                  />
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Flat No, Building, Street Area"
                    className={getInputClass("street")}
                  />
                </div>
                {errors.street && (
                  <p className="text-xs text-red-500 pl-2 font-medium flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.street}
                  </p>
                )}
              </div>

              {/* City & State Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="relative group">
                    <MapPin
                      className={`absolute left-4 top-3.5 transition-colors ${errors.city ? "text-red-500" : "text-gray-400 group-focus-within:text-blue-500"}`}
                      size={18}
                    />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="City"
                      className={getInputClass("city")}
                    />
                  </div>
                  {errors.city && (
                    <p className="text-xs text-red-500 pl-2 font-medium">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="relative group">
                    <Navigation
                      className={`absolute left-4 top-3.5 transition-colors ${errors.state ? "text-red-500" : "text-gray-400 group-focus-within:text-blue-500"}`}
                      size={18}
                    />
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="State"
                      className={getInputClass("state")}
                    />
                  </div>
                  {errors.state && (
                    <p className="text-xs text-red-500 pl-2 font-medium">
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>

              {/* Pincode */}
              <div className="space-y-1">
                <div className="relative group">
                  <Hash
                    className={`absolute left-4 top-3.5 transition-colors ${errors.pincode ? "text-red-500" : "text-gray-400 group-focus-within:text-blue-500"}`}
                    size={18}
                  />
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="6-Digit PIN Code"
                    maxLength={6}
                    className={getInputClass("pincode")}
                  />
                </div>
                {errors.pincode && (
                  <p className="text-xs text-red-500 pl-2 font-medium flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.pincode}
                  </p>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Address"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
