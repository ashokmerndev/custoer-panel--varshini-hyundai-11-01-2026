// src/lib/api/wishlist.ts
import apiClient from '@/services/apiClient';

// Backend Response Types based on your documentation
export interface ToggleWishlistResponse {
  success: boolean;
  message: string;
  action: 'added' | 'removed';
  wishlist: any;
}

export interface CheckWishlistResponse {
  inWishlist: boolean;
}

export interface GetWishlistResponse {
  success: boolean;
  products: {
    product: any;
    addedAt: string;
  }[];
  count: number;
}

export const wishlistAPI = {
  // 1. Toggle (Add/Remove)
  toggleWishlist: async (productId: string): Promise<ToggleWishlistResponse> => {
    const { data } = await apiClient.post('/wishlist/toggle', { productId });
    return data;
  },

  // 2. Check Status
  checkWishlist: async (productId: string): Promise<CheckWishlistResponse> => {
    const { data } = await apiClient.get(`/wishlist/check/${productId}`);
    return data;
  },

  // 3. Get All Items
  getWishlist: async (): Promise<GetWishlistResponse> => {
    const { data } = await apiClient.get('/wishlist');
    return data;
  },

  // 4. Clear All
  clearWishlist: async (): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.delete('/wishlist/clear');
    return data;
  }
};