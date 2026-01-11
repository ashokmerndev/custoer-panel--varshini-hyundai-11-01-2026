// src/components/checkout/AddAddressModal.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import apiClient from '@/services/apiClient';
import toast from 'react-hot-toast';
import styles from './AddAddressModal.module.css';

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

export const AddAddressModal: React.FC<AddAddressModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    addressType: 'Home',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.street.trim()) {
      toast.error('Please enter street address');
      return;
    }
    if (!formData.city.trim()) {
      toast.error('Please enter city');
      return;
    }
    if (!formData.state.trim()) {
      toast.error('Please enter state');
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      toast.error('Please enter valid 6-digit pincode');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/auth/address', formData);

      if (response.data.success) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error adding address:', error);
      const errorMessage = error.response?.data?.error || 'Failed to add address';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className={styles.backdrop}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: 'spring', damping: 25 }}
        className={styles.modal}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <MapPin className="text-hyundai-blue" size={24} />
            <h3 className={styles.title}>Add Delivery Address</h3>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Address Type */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Address Type</label>
            <select
              name="addressType"
              value={formData.addressType}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Street Address */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="123 Main Street, Apartment 4B"
              className={styles.input}
              required
            />
          </div>

          {/* City and State */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Mumbai"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Maharashtra"
                className={styles.input}
                required
              />
            </div>
          </div>

          {/* Pincode */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              PIN Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="400001"
              maxLength={6}
              pattern="[0-9]{6}"
              className={styles.input}
              required
            />
          </div>

          {/* Submit Button */}
          <div className={styles.actions}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Adding...' : 'Add Address'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </>
  );
};
