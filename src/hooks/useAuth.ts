// // src/hooks/useAuth.ts
// import { useState, useEffect, useCallback } from 'react';
// import { useStore } from '@/store/useStore';
// import apiClient, {
//   setAuthTokens,
//   clearAuthTokens,
//   isAuthenticated,
//   refreshTokenManually
// } from '@/services/apiClient';
// import socketService from '@/services/socketService';
// import toast from 'react-hot-toast';

// interface LoginCredentials {
//   email: string;
//   password: string;
// }

// interface RegisterData {
//   name: string;
//   email: string;
//   password: string;
//   phone: string;
// }

// export const useAuth = () => {
//   const { user, setUser, logout: logoutStore } = useStore();
//   const [loading, setLoading] = useState(true);
//   const [authChecked, setAuthChecked] = useState(false);

//   // ==================== CHECK AUTH STATUS ON MOUNT ====================
//   useEffect(() => {
//     checkAuthStatus();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ==================== PERIODIC TOKEN REFRESH ====================
//   // Refresh token every 10 minutes (before 15min expiry)
//   useEffect(() => {
//     if (!authChecked || !user) return;

//     // Only set up refresh if we are actually authenticated
//     if (!isAuthenticated()) return;

//     console.log('⏰ [AUTH] Setting up periodic token refresh');

//     const refreshInterval = setInterval(() => {
//       if (isAuthenticated()) {
//         console.log('⏰ [AUTH] Periodic token refresh triggered');
//         refreshTokenManually().catch(err => {
//             // If manual refresh fails with 429, we just ignore it for this cycle
//             if (err.response?.status === 429) {
//                 console.warn('⚠️ [AUTH] Periodic refresh skipped due to Rate Limit');
//             }
//         });
//       }
//     }, 10 * 60 * 1000); // 10 minutes

//     return () => {
//       console.log('🛑 [AUTH] Clearing periodic token refresh');
//       clearInterval(refreshInterval);
//     };
//   }, [authChecked, user]);

//   // ==================== CHECK AUTHENTICATION STATUS ====================
//   const checkAuthStatus = useCallback(async () => {
//     // Check if we have tokens locally first
//     if (!isAuthenticated()) {
//       console.log('ℹ️ [AUTH] No tokens found, user not authenticated');
//       setLoading(false);
//       setAuthChecked(true);
//       return;
//     }

//     try {
//       console.log('🔍 [AUTH] Checking authentication status...');
//       const response = await apiClient.get('/auth/profile');

//       if (response.data.success) {
//         const userData = response.data.data.user;
//         setUser(userData);

//         // Connect socket after successful authentication
//         socketService.connect();

//         console.log('✅ [AUTH] User authenticated:', userData.email);
//       }
//     } catch (error: any) {
//       console.error('❌ [AUTH] Auth check failed:', error.message);

//       const status = error.response?.status;

//       // CRITICAL FIX: Handle specific error codes
//       if (status === 401) {
//         // 401: Unauthorized -> Token expired or invalid. Logout.
//         console.warn('🔒 [AUTH] 401 received. Clearing session.');
//         clearAuthTokens();
//         setUser(null);
//       }
//       else if (status === 429) {
//         // 429: Rate Limit -> Server is busy. DO NOT LOGOUT.
//         // We assume the local token is still valid, just couldn't verify it right now.
//         console.warn('⚠️ [AUTH] Rate limit (429) hit. Keeping local session active.');
//         // We leave 'user' as is (if it exists) or wait for next check.
//       }
//       else {
//         // 500 or Network Error -> Server issue.
//         // Safer to keep local session alive than to force logout on network blip.
//         console.warn(`⚠️ [AUTH] API Error ${status}. Preserving local session.`);
//       }

//     } finally {
//       setLoading(false);
//       setAuthChecked(true);
//     }
//   }, [setUser]);

//   // ==================== LOGIN ====================
//   const login = async (credentials: LoginCredentials) => {
//     setLoading(true);
//     try {
//       console.log('🔐 [AUTH] Attempting login for:', credentials.email);

//       const response = await apiClient.post('/auth/login', credentials);

//       if (response.data.success) {
//         const { user: userData, accessToken, refreshToken } = response.data.data;

//         // Save tokens
//         setAuthTokens(accessToken, refreshToken);

//         // Set user in store
//         setUser(userData);

//         // Connect socket
//         socketService.connect();

//         console.log('✅ [AUTH] Login successful:', userData.email);
//         toast.success(`Welcome back, ${userData.name}!`);

//         return { success: true, user: userData };
//       }
//     } catch (error: any) {
//       console.error('❌ [AUTH] Login failed:', error);
//       const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
//       toast.error(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== REGISTER ====================
//   const register = async (data: RegisterData) => {
//     setLoading(true);
//     try {
//       console.log('📝 [AUTH] Attempting registration for:', data.email);

//       const response = await apiClient.post('/auth/register', data);

//       if (response.data.success) {
//         const { user: userData, accessToken, refreshToken } = response.data.data;

//         // Save tokens
//         setAuthTokens(accessToken, refreshToken);

//         // Set user in store
//         setUser(userData);

//         // Connect socket
//         socketService.connect();

//         console.log('✅ [AUTH] Registration successful:', userData.email);
//         toast.success(`Welcome, ${userData.name}! Your account has been created.`);

//         return { success: true, user: userData };
//       }
//     } catch (error: any) {
//       console.error('❌ [AUTH] Registration failed:', error);
//       const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
//       toast.error(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== LOGOUT ====================
//   const logout = async () => {
//     setLoading(true);
//     try {
//       console.log('👋 [AUTH] Logging out...');

//       // Call backend logout endpoint
//       try {
//         await apiClient.post('/auth/logout');
//       } catch (error) {
//         // Ignore errors from logout endpoint
//         console.warn('⚠️ [AUTH] Logout endpoint error (ignored):', error);
//       }
//     } finally {
//       // Clear tokens and user state regardless of API call result
//       clearAuthTokens();
//       logoutStore();

//       // Disconnect socket
//       socketService.disconnect();

//       console.log('✅ [AUTH] Logout complete');
//       toast.success('You have been logged out');

//       setLoading(false);

//       // Redirect to login page
//       if (typeof window !== 'undefined') {
//         window.location.href = '/login';
//       }
//     }
//   };

//   // ==================== UPDATE PROFILE ====================
//   const updateProfile = async (data: Partial<RegisterData>) => {
//     setLoading(true);
//     try {
//       console.log('✏️ [AUTH] Updating profile...');

//       const response = await apiClient.put('/auth/profile', data);

//       if (response.data.success) {
//         const updatedUser = response.data.data.user;
//         setUser(updatedUser);

//         console.log('✅ [AUTH] Profile updated successfully');
//         toast.success('Profile updated successfully');

//         return { success: true, user: updatedUser };
//       }
//     } catch (error: any) {
//       console.error('❌ [AUTH] Profile update failed:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to update profile';
//       toast.error(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== CHANGE PASSWORD ====================
//   const changePassword = async (oldPassword: string, newPassword: string) => {
//     setLoading(true);
//     try {
//       console.log('🔒 [AUTH] Changing password...');

//       const response = await apiClient.put('/auth/change-password', {
//         oldPassword,
//         newPassword,
//       });

//       if (response.data.success) {
//         console.log('✅ [AUTH] Password changed successfully');
//         toast.success('Password changed successfully. Please login again.');

//         // Logout user after password change for security
//         setTimeout(() => {
//           logout();
//         }, 2000);

//         return { success: true };
//       }
//     } catch (error: any) {
//       console.error('❌ [AUTH] Password change failed:', error);
//       const errorMessage = error.response?.data?.error || 'Failed to change password';
//       toast.error(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== MANUAL REFRESH ====================
//   const refreshToken = useCallback(async () => {
//     console.log('🔄 [AUTH] Manual token refresh requested');
//     const success = await refreshTokenManually();

//     if (success) {
//       // Optionally re-fetch user profile to ensure data consistency
//       await checkAuthStatus();
//     } else {
//       // Only logout if refresh actually FAILED (invalid refresh token)
//       // Do not logout if it was just a network error or rate limit
//       // (The apiClient handles logic for clearing tokens on 401)
//       console.warn('⚠️ [AUTH] Manual refresh failed');
//     }

//     return success;
//   }, [checkAuthStatus]);

//   return {
//     user,
//     loading,
//     isAuthenticated: !!user,
//     authChecked,
//     login,
//     register,
//     logout,
//     updateProfile,
//     changePassword,
//     checkAuthStatus,
//     refreshToken,
//   };
// };

// src/hooks/useAuth.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useStore } from "@/store/useStore";
import apiClient, {
  setAuthTokens,
  clearAuthTokens,
  isAuthenticated,
  refreshTokenManually,
} from "@/services/apiClient";
import socketService from "@/services/socketService";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export const useAuth = () => {
  const { user, setUser, logout: logoutStore } = useStore();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Ref helps to prevent double execution in React Strict Mode
  const isChecking = useRef(false);

  // ==================== CHECK AUTH STATUS ON MOUNT ====================
  useEffect(() => {
    // If we already have a user in store, don't fetch again (prevents multiple API calls)
    if (user) {
      setAuthChecked(true);
      setLoading(false);
      return;
    }

    if (!isChecking.current) {
      checkAuthStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==================== PERIODIC TOKEN REFRESH ====================
  // FIX: Removed 'user' from dependency array to prevent infinite loop
  useEffect(() => {
    if (!authChecked) return;

    // Only set up refresh if we are actually authenticated
    if (!isAuthenticated()) return;

    const refreshInterval = setInterval(
      () => {
        if (isAuthenticated()) {
          refreshTokenManually().catch((err) => {
            // Silently handle rate limits
            if (err.response?.status === 429) return;
          });
        }
      },
      10 * 60 * 1000,
    ); // 10 minutes

    return () => {
      clearInterval(refreshInterval);
    };
  }, [authChecked]); // <--- KEY FIX: Removed 'user' dependency

  // ==================== CHECK AUTHENTICATION STATUS ====================
  const checkAuthStatus = useCallback(async () => {
    if (isChecking.current) return;
    isChecking.current = true;

    // Check if we have tokens locally first
    if (!isAuthenticated()) {
      setLoading(false);
      setAuthChecked(true);
      isChecking.current = false;
      return;
    }

    try {
      const response = await apiClient.get("/auth/profile");

      if (response.data.success) {
        const userData = response.data.data.user;
        setUser(userData);
        socketService.connect();
      }
    } catch (error: any) {
      const status = error.response?.status;

      if (status === 401) {
        clearAuthTokens();
        setUser(null);
      }
      // Note: We ignore 429 and 500 to keep local session alive
    } finally {
      setLoading(false);
      setAuthChecked(true);
      isChecking.current = false;
    }
  }, [setUser]);

  // ==================== LOGIN ====================
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/login", credentials);

      if (response.data.success) {
        const {
          user: userData,
          accessToken,
          refreshToken,
        } = response.data.data;
        setAuthTokens(accessToken, refreshToken);
        Cookies.set("user", userData.id, {
          expires: 7,
          sameSite: "strict",
        });
        setUser(userData);
        socketService.connect();

        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ==================== REGISTER ====================
  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/register", data);

      if (response.data.success) {
        const {
          user: userData,
          accessToken,
          refreshToken,
        } = response.data.data;
        setAuthTokens(accessToken, refreshToken);
        setUser(userData);
        socketService.connect();

        toast.success(
          `Welcome, ${userData.name}! Your account has been created.`,
        );
        return { success: true, user: userData };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Registration failed.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ==================== LOGOUT ====================
  const logout = async () => {
    setLoading(true);
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      // Ignore logout errors
    } finally {
      clearAuthTokens();
      logoutStore();
      socketService.disconnect();
      toast.success("You have been logged out");
      setLoading(false);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  // ==================== UPDATE PROFILE ====================
  const updateProfile = async (data: Partial<RegisterData>) => {
    setLoading(true);
    try {
      const response = await apiClient.put("/auth/profile", data);
      if (response.data.success) {
        const updatedUser = response.data.data.user;
        setUser(updatedUser);
        toast.success("Profile updated successfully");
        return { success: true, user: updatedUser };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to update profile";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ==================== CHANGE PASSWORD ====================
  const changePassword = async (oldPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      const response = await apiClient.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      if (response.data.success) {
        toast.success("Password changed. Please login again.");
        setTimeout(() => logout(), 2000);
        return { success: true };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to change password";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ==================== MANUAL REFRESH ====================
  const refreshToken = useCallback(async () => {
    const success = await refreshTokenManually();
    if (success) {
      // Optional: Update user details silently if needed
      // await checkAuthStatus();
    }
    return success;
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    authChecked,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuthStatus,
    refreshToken,
  };
};
