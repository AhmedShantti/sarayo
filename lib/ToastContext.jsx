'use client';

import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';

const ToastContext = createContext(null);

export function ToastProvider({children}) {
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const timerRef = useRef(null);

    const showToast = useCallback((msg) => {
        setMessage(msg);
        setVisible(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setVisible(false), 2400);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <ToastContext.Provider value={{showToast}}>
            {children}
            <div
                className={`toast${visible ? ' is-visible' : ''}`}
                role="status"
                aria-live="polite"
            >
                {message}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside ToastProvider');
    return ctx;
}
