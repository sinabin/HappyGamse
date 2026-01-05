/**
 * ProtectedRoute - Route wrapper that requires authentication
 *
 * Redirects unauthenticated users to the login page.
 * Preserves the originally requested URL for post-login redirect.
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthenticationContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (loading) {
        return <LoadingSpinner fullScreen message="인증 확인 중..." />;
    }

    // If not authenticated, redirect to login with return URL
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    // If authenticated, render child routes
    return <Outlet />;
};

export default ProtectedRoute;
