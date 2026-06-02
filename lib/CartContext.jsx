'use client';

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';

const CART_KEY = 'sarayo_cart';
const CartContext = createContext(null);

function readCartFromStorage() {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function writeCartToStorage(cart) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function CartProvider({children}) {
    const [cart, setCart] = useState([]);
    const [hydrated, setHydrated] = useState(false);

    // Hydrate from localStorage after mount (avoids SSR mismatch)
    useEffect(() => {
        setCart(readCartFromStorage());
        setHydrated(true);
    }, []);

    // Persist on change (only after hydration so we don't overwrite with [] on first render)
    useEffect(() => {
        if (hydrated) writeCartToStorage(cart);
    }, [cart, hydrated]);

    // Sync with other tabs
    useEffect(() => {
        function onStorage(e) {
            if (e.key === CART_KEY) setCart(readCartFromStorage());
        }
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const addItem = useCallback((item) => {
        setCart((prev) => {
            const existing = prev.find((it) => it.id === item.id);
            if (existing) {
                return prev.map((it) =>
                    it.id === item.id ? {...it, qty: it.qty + 1} : it
                );
            }
            return [...prev, {...item, qty: 1}];
        });
    }, []);

    const incItem = useCallback((id) => {
        setCart((prev) =>
            prev.map((it) => (it.id === id ? {...it, qty: it.qty + 1} : it))
        );
    }, []);

    const decItem = useCallback((id) => {
        setCart((prev) =>
            prev
                .map((it) => (it.id === id ? {...it, qty: it.qty - 1} : it))
                .filter((it) => it.qty > 0)
        );
    }, []);

    const removeItem = useCallback((id) => {
        setCart((prev) => prev.filter((it) => it.id !== id));
    }, []);

    const clear = useCallback(() => {
        setCart([]);
    }, []);

    const count = useMemo(
        () => cart.reduce((n, it) => n + it.qty, 0),
        [cart]
    );

    const subtotal = useMemo(
        () => cart.reduce((s, it) => s + it.price * it.qty, 0),
        [cart]
    );

    const value = useMemo(
        () => ({
            cart,
            hydrated,
            count,
            subtotal,
            addItem,
            incItem,
            decItem,
            removeItem,
            clear,
        }),
        [cart, hydrated, count, subtotal, addItem, incItem, decItem, removeItem, clear]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
}
