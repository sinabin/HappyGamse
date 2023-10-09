/**
 * @Explain : React Context를 통해 selectedChannel State를 공유
 */
import React, { createContext, useState } from 'react';

export const ChannelContext = createContext();

export const ChannelProvider = ({ children }) => {
    const [selectedChannel, setSelectedChannel] = useState(null);

    return (
        <ChannelContext.Provider value={{ selectedChannel, setSelectedChannel }}>
            {children}
        </ChannelContext.Provider>
    );
};