'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface CartLine {
    name: string;
    src: string;
    flavor: string;
    price: number;
    qty: number;
}

export interface AddInput {
    name: string;
    src: string;
    flavor: string;
    priceValue: number;
}

interface CartCtx {
    items: CartLine[];
    count: number;
    subtotal: number;
    isOpen: boolean;
    open: () => void;
    close: () => void;
    add: (p: AddInput) => void;
    inc: (name: string) => void;
    dec: (name: string) => void;
    remove: (name: string) => void;
    clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = 'sarayo-landing-cart';

export function useLandingCart() {
    const c = useContext(Ctx);
    if (!c) throw new Error('useLandingCart must be used within LandingCartProvider');
    return c;
}

export default function LandingCartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartLine[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    // Load persisted cart once on mount.
    useEffect(() => {
        try {
            const raw = localStorage.getItem(KEY);
            if (raw) setItems(JSON.parse(raw) as CartLine[]);
        } catch {
            /* ignore malformed storage */
        }
        setHydrated(true);
    }, []);

    // Persist on change (after hydration so we don't overwrite with []).
    useEffect(() => {
        if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
    }, [items, hydrated]);

    const add = (p: AddInput) => {
        setItems((prev) => {
            const found = prev.find((l) => l.name === p.name);
            if (found) return prev.map((l) => (l.name === p.name ? { ...l, qty: l.qty + 1 } : l));
            return [...prev, { name: p.name, src: p.src, flavor: p.flavor, price: p.priceValue, qty: 1 }];
        });
        setIsOpen(true);
    };
    const inc = (name: string) =>
        setItems((prev) => prev.map((l) => (l.name === name ? { ...l, qty: l.qty + 1 } : l)));
    const dec = (name: string) =>
        setItems((prev) =>
            prev.flatMap((l) => (l.name === name ? (l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []) : [l]))
        );
    const remove = (name: string) => setItems((prev) => prev.filter((l) => l.name !== name));
    const clear = () => setItems([]);

    const count = items.reduce((n, l) => n + l.qty, 0);
    const subtotal = items.reduce((n, l) => n + l.qty * l.price, 0);

    return (
        <Ctx.Provider
            value={{
                items,
                count,
                subtotal,
                isOpen,
                open: () => setIsOpen(true),
                close: () => setIsOpen(false),
                add,
                inc,
                dec,
                remove,
                clear,
            }}
        >
            {children}
        </Ctx.Provider>
    );
}
