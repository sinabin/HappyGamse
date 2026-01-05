/**
 * AuthenticationContext - Global authentication state management
 *
 * Manages user authentication state, login/logout operations,
 * and provides authentication status across the application.
 *
 * Enhanced from simple isLogined state to full authentication management.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from './axiosInstance';

const AuthenticationContext = createContext();

/**
 * Custom hook to access authentication context
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
    const context = useContext(AuthenticationContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthenticationProvider');
    }
    return context;
};

// Backward compatibility with existing code
export const useAuthentication = () => {
    return useAuth();
};

export const AuthenticationProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Check current authentication status
     * Calls /api/is-authenticated endpoint
     */
    const checkAuth = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await authAPI.checkAuthentication();
            const authStatus = response.data;

            setIsAuthenticated(authStatus);

            // If authenticated, fetch user info (if available from backend)
            if (authStatus) {
                // TODO: If backend provides /api/user/me endpoint, fetch user details
                // For now, we just set authenticated status
                // const userResponse = await fetch('/api/user/me');
                // const userData = await userResponse.json();
                // setUser(userData);
                setUser({ authenticated: true }); // Placeholder
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error('Authentication check failed:', err);
            setIsAuthenticated(false);
            setUser(null);
            setError('인증 상태 확인에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Log in user with credentials
     * @param {string} userId - User ID
     * @param {string} password - Password
     * @returns {Promise<Object>} Result with success status and message
     */
    const login = useCallback(async (userId, password) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authAPI.login(userId, password);

            // Check response data for success
            if (response.data && response.data.success !== false) {
                // Refresh authentication status
                await checkAuth();
                return { success: true };
            } else {
                const message = response.data?.message || '로그인에 실패했습니다.';
                setError(message);
                return { success: false, message };
            }
        } catch (err) {
            console.error('Login failed:', err);
            const message = err.response?.data?.message || '로그인 중 오류가 발생했습니다.';
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, [checkAuth]);

    /**
     * Log out current user
     * @returns {Promise<void>}
     */
    const logout = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            await authAPI.logout();

            // Clear authentication state
            setIsAuthenticated(false);
            setUser(null);
        } catch (err) {
            console.error('Logout failed:', err);
            // Even if logout API fails, clear local state
            setIsAuthenticated(false);
            setUser(null);
            setError('로그아웃 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Initial authentication check on mount
     */
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const value = {
        // State
        isAuthenticated,
        user,
        loading,
        error,

        // Methods
        login,
        logout,
        checkAuth,

        // Backward compatibility
        isLogined: { authenticated: isAuthenticated }
    };

    return (
        <AuthenticationContext.Provider value={value}>
            {children}
        </AuthenticationContext.Provider>
    );
};
