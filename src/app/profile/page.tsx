// src/app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Phone,
  Mail,
  Home,
  Building,
} from 'lucide-react';
import apiClient from '@/services/apiClient';
import toast from 'react-hot-toast';
import { Address } from '@/store/useStore';
import styles from './page.module.css';

type Tab = 'profile' | 'orders' | 'addresses';

interface AddressFormData {
  addressType: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
  });

  // Address form state
  const [addressData, setAddressData] = useState<AddressFormData>({
    addressType: 'Home',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        phone: user.phone,
      });
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      if (response.data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/address', addressData);
      if (response.data.success) {
        toast.success('Address added successfully');
        setShowAddressModal(false);
        resetAddressForm();
        // Refresh user data to get updated addresses
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    if (!editingAddress) return;
    
    setLoading(true);
    try {
      const response = await apiClient.put(`/auth/address/${editingAddress._id}`, addressData);
      if (response.data.success) {
        toast.success('Address updated successfully');
        setShowAddressModal(false);
        setEditingAddress(null);
        resetAddressForm();
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const response = await apiClient.delete(`/auth/address/${addressId}`);
      if (response.data.success) {
        toast.success('Address deleted successfully');
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete address');
    }
  };

  const openAddressModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setAddressData({
        addressType: address.addressType,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: address.isDefault,
      });
    }
    setShowAddressModal(true);
  };

  const resetAddressForm = () => {
    setAddressData({
      addressType: 'Home',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
    setEditingAddress(null);
  };

  if (authLoading || !user) {
    return <LoadingSkeleton />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.sidebar}
        >
          <div className={styles.sidebarHeader}>
            <div className={styles.avatar}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className={styles.userName}>{user.name}</h2>
            <p className={styles.userEmail}>{user.email}</p>
          </div>

          <nav className={styles.nav}>
            <button
              onClick={() => setActiveTab('profile')}
              className={`${styles.navItem} ${activeTab === 'profile' ? styles.navItemActive : ''}`}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`${styles.navItem} ${activeTab === 'orders' ? styles.navItemActive : ''}`}
            >
              <Package size={20} />
              <span>Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`${styles.navItem} ${activeTab === 'addresses' ? styles.navItemActive : ''}`}
            >
              <MapPin size={20} />
              <span>Addresses</span>
            </button>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.mainContent}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={styles.section}
              >
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Profile Information</h2>
                  {!isEditing ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className={styles.iconButton}
                    >
                      <Edit size={18} />
                      Edit
                    </motion.button>
                  ) : (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleProfileUpdate}
                        disabled={loading}
                        className={styles.saveButton}
                      >
                        <Save size={18} />
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setIsEditing(false);
                          setProfileData({ name: user.name, phone: user.phone });
                        }}
                        className={styles.cancelButton}
                      >
                        <X size={18} />
                        Cancel
                      </motion.button>
                    </div>
                  )}
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <User size={16} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditing}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <Mail size={16} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className={styles.inputDisabled}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <Phone size={16} />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                      className={styles.input}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={styles.section}
              >
                <h2 className={styles.sectionTitle}>Order History</h2>
                <p className={styles.comingSoon}>
                  View your order history at <a href="/orders" className="text-hyundai-blue hover:underline">/orders</a>
                </p>
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={styles.section}
              >
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Saved Addresses</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openAddressModal()}
                    className={styles.addButton}
                  >
                    <Plus size={18} />
                    Add Address
                  </motion.button>
                </div>

                <div className={styles.addressGrid}>
                  {user.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((address, index) => (
                      <motion.div
                        key={address._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={styles.addressCard}
                      >
                        {address.isDefault && (
                          <span className={styles.defaultBadge}>Default</span>
                        )}
                        
                        <div className={styles.addressHeader}>
                          <div className={styles.addressType}>
                            {address.addressType === 'Home' ? <Home size={20} /> : <Building size={20} />}
                            <span>{address.addressType}</span>
                          </div>
                          <div className={styles.addressActions}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openAddressModal(address)}
                              className={styles.actionIcon}
                            >
                              <Edit size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteAddress(address._id)}
                              className={`${styles.actionIcon} ${styles.deleteIcon}`}
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </div>

                        <div className={styles.addressDetails}>
                          <p>{address.street}</p>
                          <p>{address.city}, {address.state}</p>
                          <p>PIN: {address.pincode}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className={styles.noAddresses}>
                      No addresses saved. Add your first address to get started!
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>

     {/* Address Modal */}
<AnimatePresence>
  {showAddressModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay - Centering Helper */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          setShowAddressModal(false);
          resetAddressForm();
        }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content - Centered */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-[#0A101F] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden z-10"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button
            onClick={() => {
              setShowAddressModal(false);
              resetAddressForm();
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Address Type</label>
            <select
              value={addressData.addressType}
              onChange={(e) => setAddressData({ ...addressData, addressType: e.target.value })}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-hyundai-blue focus:outline-none"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Street Address</label>
            <input
              type="text"
              value={addressData.street}
              onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
              placeholder="123 Main Street"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-hyundai-blue focus:outline-none placeholder:text-gray-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">City</label>
              <input
                type="text"
                value={addressData.city}
                onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                placeholder="Mumbai"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-hyundai-blue focus:outline-none placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">State</label>
              <input
                type="text"
                value={addressData.state}
                onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                placeholder="MH"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-hyundai-blue focus:outline-none placeholder:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">PIN Code</label>
            <input
              type="text"
              value={addressData.pincode}
              onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
              placeholder="400001"
              maxLength={6}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-hyundai-blue focus:outline-none placeholder:text-gray-600"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={addressData.isDefault}
              onChange={(e) => setAddressData({ ...addressData, isDefault: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-black/20 text-hyundai-blue focus:ring-offset-0 focus:ring-transparent"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-300 cursor-pointer select-none">
              Set as default address
            </label>
          </div>
        </div>

        <div className="p-6 pt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
            disabled={loading}
            className="w-full bg-hyundai-blue hover:bg-blue-600 text-white font-medium py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
          >
            {loading ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={`${styles.sidebar} skeleton`} />
        <div className={`${styles.mainContent} skeleton`} />
      </div>
    </div>
  );
}
