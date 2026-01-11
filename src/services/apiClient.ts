// src/services/apiClient.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ==================== TOKEN REFRESH STATE ====================
// Prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// Process queued requests after token refresh
const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// ==================== AXIOS INSTANCE ====================
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if using HTTP-only cookies from backend
});

// ==================== REQUEST INTERCEPTOR ====================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = Cookies.get('accessToken');
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('🔑 [AUTH] Request with token:', config.url);
    } else {
      console.log('⚠️ [AUTH] Request without token:', config.url);
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ [REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// ==================== RESPONSE INTERCEPTOR ====================
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Successful response - no action needed
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // ========== HANDLE 401 UNAUTHORIZED ==========
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      console.log('🔄 [AUTH] 401 Detected - Token may be expired');

      // Check if this is the refresh token endpoint itself failing
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        console.error('❌ [AUTH] Refresh token is invalid or expired');
        
        // Clear everything and redirect to login
        clearAuthTokens();
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login?session_expired=true';
        }
        
        return Promise.reject(error);
      }

      // Mark request as retried to prevent infinite loops
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refreshToken');

      if (!refreshToken) {
        console.error('❌ [AUTH] No refresh token found - redirecting to login');
        
        clearAuthTokens();
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }

      // ========== QUEUE MANAGEMENT FOR CONCURRENT REQUESTS ==========
      if (isRefreshing) {
        console.log('⏳ [AUTH] Refresh in progress, queuing request...');
        
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            console.log('✅ [AUTH] Retrying queued request with new token');
            return apiClient(originalRequest);
          })
          .catch((err) => {
            console.error('❌ [AUTH] Queued request failed:', err);
            return Promise.reject(err);
          });
      }

      // ========== START TOKEN REFRESH ==========
      isRefreshing = true;
      console.log('🔄 [AUTH] Starting token refresh...');

      try {
        // Call refresh token endpoint
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

        if (!newAccessToken || !newRefreshToken) {
          throw new Error('Invalid token response from server');
        }

        console.log('✅ [AUTH] Token refresh successful!');

        // Save new tokens
        setAuthTokens(newAccessToken, newRefreshToken);

        // Update the authorization header for the original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Process any queued requests
        processQueue(null, newAccessToken);

        // Retry the original request
        console.log('🔄 [AUTH] Retrying original request with new token');
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        console.error('❌ [AUTH] Token refresh failed:', refreshError);

        // Process queue with error
        processQueue(refreshError, null);

        // Clear tokens
        clearAuthTokens();

        // Redirect to login
        if (typeof window !== 'undefined') {
          const errorMessage =
            refreshError.response?.data?.error || 'Session expired. Please login again.';
          
          window.location.href = `/login?error=${encodeURIComponent(errorMessage)}`;
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ========== HANDLE OTHER ERRORS ==========
    if (error.response?.status === 403) {
      console.error('🚫 [AUTH] 403 Forbidden - Insufficient permissions');
    } else if (error.response?.status === 429) {
      console.error('⏱️ [RATE LIMIT] 429 Too Many Requests - Slow down!');
    } else if (error.response?.status === 500) {
      console.error('💥 [SERVER ERROR] 500 Internal Server Error');
    } else if (!error.response) {
      console.error('🌐 [NETWORK ERROR] No response from server');
    }

    return Promise.reject(error);
  }
);

// ==================== HELPER FUNCTIONS ====================

/**
 * Save authentication tokens to cookies
 */
export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Access Token (15 minutes)
  Cookies.set('accessToken', accessToken, {
    expires: 7, 
    secure: isProduction,
    sameSite: 'strict',
  });

  // Refresh Token (7 days)
  Cookies.set('refreshToken', refreshToken, {
    expires: 7,
    secure: isProduction,
    sameSite: 'strict',
  });

  console.log('💾 [AUTH] Tokens saved successfully');
};

/**
 * Clear all authentication tokens
 */
export const clearAuthTokens = (): void => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  console.log('🗑️ [AUTH] Tokens cleared');
};

/**
 * Get access token from cookies
 */
export const getAccessToken = (): string | undefined => {
  return Cookies.get('accessToken');
};

/**
 * Get refresh token from cookies
 */
export const getRefreshToken = (): string | undefined => {
  return Cookies.get('refreshToken');
};

/**
 * Check if user is authenticated (has valid tokens)
 */
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  return !!(accessToken || refreshToken);
};

/**
 * Manually trigger token refresh
 * Useful for background refresh or periodic checks
 */
export const refreshTokenManually = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    console.error('❌ [AUTH] No refresh token available for manual refresh');
    return false;
  }

  try {
    console.log('🔄 [AUTH] Manual token refresh initiated...');
    
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

    setAuthTokens(newAccessToken, newRefreshToken);
    
    console.log('✅ [AUTH] Manual token refresh successful');
    return true;
  } catch (error) {
    console.error('❌ [AUTH] Manual token refresh failed:', error);
    clearAuthTokens();
    return false;
  }
};

export default apiClient;
