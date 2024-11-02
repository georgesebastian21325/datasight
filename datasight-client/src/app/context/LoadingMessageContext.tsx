'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

type LoadingMessageContextType = {
    message: string;
    setMessage: (message: string) => void;
};

const LoadingMessageContext = createContext<LoadingMessageContextType | undefined>(undefined);

export const LoadingMessageProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState('System Loading');
    return (
        <LoadingMessageContext.Provider value={{ message, setMessage }}>
            {children}
        </LoadingMessageContext.Provider>
    );
};

export const useLoadingMessage = () => {
    const context = useContext(LoadingMessageContext);
    if (!context) {
        throw new Error('useLoadingMessage must be used within a LoadingMessageProvider');
    }
    return context;
};
