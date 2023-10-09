/**
 * @Explain : React Context를 통해 isLogined State를 공유
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthenticationContext = createContext();

export const useAuthentication = () => {
    return useContext(AuthenticationContext);
};

export const AuthenticationProvider = ({ children }) => {
    const [isLogined, setIsLogined] = useState(false);

    useEffect(() => {
        const fetchAuthentication = async () => {
            const response = await fetch("/api/is-authenticated");
            const isAuthenticated = await response.json();
            setIsLogined(isAuthenticated);
        };
        fetchAuthentication();
    }, []);

    return (
        <AuthenticationContext.Provider value={isLogined}>
            {children}
        </AuthenticationContext.Provider>
    );
};
